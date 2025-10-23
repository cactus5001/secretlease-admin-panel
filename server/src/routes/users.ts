import express, { Router, Response } from 'express';
import { prisma } from '../index';
import { auth, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        role: true,
        hasPaid: true,
        favorites: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// @route   POST /api/users/favorites/:listingId
// @desc    Add listing to favorites
// @access  Private
router.post('/favorites/:listingId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const listingId = req.params.listingId;

    if (user.favorites.includes(listingId)) {
      return res.status(400).json({
        success: false,
        message: 'Listing already in favorites'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        favorites: {
          push: listingId
        }
      }
    });

    res.json({
      success: true,
      message: 'Listing added to favorites',
      data: updatedUser.favorites
    });
  } catch (error: any) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding favorite',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/favorites/:listingId
// @desc    Remove listing from favorites
// @access  Private
router.delete('/favorites/:listingId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const listingId = req.params.listingId;
    const updatedFavorites = user.favorites.filter(fav => fav !== listingId);

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        favorites: updatedFavorites
      }
    });

    res.json({
      success: true,
      message: 'Listing removed from favorites',
      data: updatedUser.favorites
    });
  } catch (error: any) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing favorite',
      error: error.message
    });
  }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorite listings
// @access  Private
router.get('/favorites', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: user.favorites
        }
      }
    });

    res.json({
      success: true,
      data: favorites
    });
  } catch (error: any) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
});

export default router;
