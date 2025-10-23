import express, { Express, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { keepAliveService } from './utils/keepAlive';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Import routes
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import transactionRoutes from './routes/transactions';
import adminRoutes from './routes/admin';
import userRoutes from './routes/users';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://secretlease-admin-panel-ldy0xkm5g-cactus-projects-f15019d1.vercel.app',
  'https://secretlease-admin-panel-3sjnyp36b-cactus-projects-f15019d1.vercel.app',
  'https://secretlease-admin-panel-dsvuhdf2e-cactus-projects-f15019d1.vercel.app',
  'https://secretlease-admin-panel-dldio8jhu-cactus-projects-f15019d1.vercel.app',
  'https://secretlease-admin-panel-cr659a5hh-cactus-projects-f15019d1.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Exact allow-list match
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);

    // Allow a configured CLIENT_URL env var
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);

    // Allow Vercel preview/deployment domains under vercel.app (convenience for previews)
    try {
      const parsed = new URL(origin);
      if (parsed.hostname && parsed.hostname.endsWith('.vercel.app')) return callback(null, true);
    } catch (err) {
      // ignore invalid origin format
    }

    // Not allowed
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'SecretLease API is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection (for Vercel serverless)
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Neon PostgreSQL connected successfully');
    
    // Only start keep-alive in non-serverless environments
    if (process.env.VERCEL !== '1') {
      keepAliveService.start();
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
  }
};

// Initialize DB connection
connectDB();

// Graceful shutdown (only for non-serverless)
if (process.env.VERCEL !== '1') {
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    keepAliveService.stop();
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    keepAliveService.stop();
    await prisma.$disconnect();
    process.exit(0);
  });
}

// Start server (only for local development)
if (process.env.VERCEL !== '1') {
  const startServer = async () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  };

  startServer();
}

export default app;
