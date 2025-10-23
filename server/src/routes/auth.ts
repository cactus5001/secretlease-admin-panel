import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';

const router: Router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user with payment details
// @access  Public
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('paymentMethod').isIn(['paypal', 'btc', 'usdt']).withMessage('Payment method must be paypal, btc, or usdt'),
    body('paymentEmail').optional().isString(),
    body('walletAddress').optional().isString(),
    body('transactionHash').notEmpty().withMessage('Transaction hash is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, password, paymentMethod, paymentEmail, walletAddress, transactionHash } = req.body;

      // Validate payment details based on method
      if (paymentMethod === 'paypal' && !paymentEmail) {
        return res.status(400).json({
          success: false,
          message: 'PayPal email is required for PayPal payments'
        });
      }

      if ((paymentMethod === 'btc' || paymentMethod === 'usdt') && !walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address is required for crypto payments'
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user (not approved by default)
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'user',
          isApproved: false, // Requires admin approval
          paymentMethod,
          paymentEmail: paymentMethod === 'paypal' ? paymentEmail : null,
          walletAddress: (paymentMethod === 'btc' || paymentMethod === 'usdt') ? walletAddress : null,
          transactionHash
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        message: 'Registration submitted successfully. Please wait for admin approval.',
        data: {
          token,
          user: userWithoutPassword
        }
      });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: userWithoutPassword
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error logging in',
        error: error.message
      });
    }
  }
);

export default router;
