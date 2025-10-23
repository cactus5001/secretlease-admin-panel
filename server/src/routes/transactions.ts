import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { auth, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, method } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        userEmail: user.email,
        amount,
        method,
        status: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Transaction submitted successfully',
      data: transaction
    });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating transaction',
      error: error.message
    });
  }
});

// @route   GET /api/transactions
// @desc    Get all transactions
// @access  Private
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const where: any = {};

    if (req.userRole !== 'admin') {
      where.userId = req.userId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

// @route   PUT /api/transactions/:id/approve
// @desc    Approve transaction
// @access  Private/Admin
router.put('/:id/approve', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Transaction is not pending'
      });
    }

    // Update transaction and user in a transaction
    const [updatedTransaction] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id: req.params.id },
        data: { status: 'completed' }
      }),
      prisma.user.update({
        where: { id: transaction.userId },
        data: { hasPaid: true }
      })
    ]);

    res.json({
      success: true,
      message: 'Transaction approved successfully',
      data: updatedTransaction
    });
  } catch (error: any) {
    console.error('Approve transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving transaction',
      error: error.message
    });
  }
});

// @route   PUT /api/transactions/:id/reject
// @desc    Reject transaction
// @access  Private/Admin
router.put('/:id/reject', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: { status: 'rejected' }
    });

    res.json({
      success: true,
      message: 'Transaction rejected',
      data: transaction
    });
  } catch (error: any) {
    console.error('Reject transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting transaction',
      error: error.message
    });
  }
});

export default router;
