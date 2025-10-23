import express, { Router, Response } from 'express';
import { prisma } from '../index';
import { auth, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const [
      totalUsers,
      paidUsers,
      pendingSignups,
      totalListings,
      pendingTransactions,
      completedTransactions,
      revenueData
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { hasPaid: true } }),
      prisma.user.count({ where: { isApproved: false, role: 'user' } }),
      prisma.listing.count({ where: { isActive: true } }),
      prisma.transaction.count({ where: { status: 'pending' } }),
      prisma.transaction.count({ where: { status: 'completed' } }),
      prisma.transaction.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true }
      })
    ]);

    const totalRevenue = revenueData._sum.amount || 0;
    const conversionRate = totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        paidUsers,
        pendingSignups,
        totalListings,
        pendingTransactions,
        completedTransactions,
        totalRevenue,
        conversionRate
      }
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// @route   GET /api/admin/config
// @desc    Get admin configuration
// @access  Private/Admin
router.get('/config', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    let config = await prisma.adminConfig.findFirst();

    if (!config) {
      config = await prisma.adminConfig.create({
        data: {
          paypalEmail: 'payments@secretlease.com',
          btcAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          usdtAddress: 'TJsH5K8xxxTRC20xxxADDRESSxxx7Y3z',
          priceUsd: 60
        }
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error: any) {
    console.error('Get config error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching configuration',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/config
// @desc    Update admin configuration
// @access  Private/Admin
router.put('/config', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { paypalEmail, btcAddress, usdtAddress, priceUsd } = req.body;
    const existing = await prisma.adminConfig.findFirst();

    let config;
    if (existing) {
      config = await prisma.adminConfig.update({
        where: { id: existing.id },
        data: { paypalEmail, btcAddress, usdtAddress, priceUsd }
      });
    } else {
      config = await prisma.adminConfig.create({
        data: { paypalEmail, btcAddress, usdtAddress, priceUsd }
      });
    }

    res.json({
      success: true,
      message: 'Configuration updated successfully',
      data: config
    });
  } catch (error: any) {
    console.error('Update config error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating configuration',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with payment details
// @access  Private/Admin
router.get('/users', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isApproved: true,
        hasPaid: true,
        paymentMethod: true,
        paymentEmail: true,
        walletAddress: true,
        transactionHash: true,
        favorites: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @route   GET /api/admin/pending-signups
// @desc    Get all pending user signups awaiting approval
// @access  Private/Admin
router.get('/pending-signups', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const pendingUsers = await prisma.user.findMany({
      where: {
        isApproved: false,
        role: 'user'
      },
      select: {
        id: true,
        email: true,
        paymentMethod: true,
        paymentEmail: true,
        walletAddress: true,
        transactionHash: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error: any) {
    console.error('Get pending signups error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending signups',
      error: error.message
    });
  }
});

// @route   POST /api/admin/approve-user/:id
// @desc    Approve a pending user signup
// @access  Private/Admin
router.post('/approve-user/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { id } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'User is already approved'
      });
    }

    // Approve user and mark as paid
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isApproved: true,
        hasPaid: true
      },
      select: {
        id: true,
        email: true,
        isApproved: true,
        hasPaid: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User approved successfully',
      data: updatedUser
    });
  } catch (error: any) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving user',
      error: error.message
    });
  }
});

// @route   POST /api/admin/reject-user/:id
// @desc    Reject a pending user signup
// @access  Private/Admin
router.post('/reject-user/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { id } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'User signup rejected and removed'
    });
  } catch (error: any) {
    console.error('Reject user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting user',
      error: error.message
    });
  }
});

export default router;
