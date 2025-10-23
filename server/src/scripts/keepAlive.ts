import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

/**
 * Standalone script to keep Neon DB alive
 * Can be run separately from the main server
 * Usage: npm run keep-alive
 */

const PING_INTERVAL = 4 * 60 * 1000; // 4 minutes

async function ping() {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    console.log(`✅ [${timestamp}] Neon DB pinged (${duration}ms)`);
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] Ping failed:`, error);
    
    // Try to reconnect
    try {
      await prisma.$connect();
      console.log('🔌 Reconnected');
    } catch (reconnectError) {
      console.error('❌ Reconnect failed:', reconnectError);
    }
  }
}

async function start() {
  console.log('🔄 Neon DB Keep-Alive Service');
  console.log(`⏰ Ping interval: ${PING_INTERVAL / 1000 / 60} minutes`);
  console.log('Press Ctrl+C to stop\n');

  // Connect to database
  try {
    await prisma.$connect();
    console.log('✅ Connected to Neon PostgreSQL\n');
  } catch (error) {
    console.error('❌ Failed to connect:', error);
    process.exit(1);
  }

  // Initial ping
  await ping();

  // Set up periodic pinging
  setInterval(ping, PING_INTERVAL);
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down keep-alive service...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down keep-alive service...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the service
start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
