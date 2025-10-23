import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { auth, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// @route   GET /api/listings/search
// @desc    Search listings by city and budget
// @access  Public
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { city, maxBudget, sortBy } = req.query;

    const where: any = { isActive: true };
    
    if (city) {
      where.city = city as string;
    }
    
    if (maxBudget) {
      where.price = { lte: Number(maxBudget) };
    }

    let orderBy: any = { createdAt: 'desc' }; // Default: newest first
    
    if (sortBy === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price-high') {
      orderBy = { price: 'desc' };
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      take: 60
    });

    res.json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error: any) {
    console.error('Search listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching listings',
      error: error.message
    });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    res.json({
      success: true,
      data: listing
    });
  } catch (error: any) {
    console.error('Get listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listing',
      error: error.message
    });
  }
});

// @route   POST /api/listings
// @desc    Create new listing (Admin only)
// @access  Private/Admin
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const listing = await prisma.listing.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: listing
    });
  } catch (error: any) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating listing',
      error: error.message
    });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update listing (Admin only)
// @access  Private/Admin
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: listing
    });
  } catch (error: any) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating listing',
      error: error.message
    });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete listing (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    await prisma.listing.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting listing',
      error: error.message
    });
  }
});

export default router;
