import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Keep Neon DB alive by running periodic queries
 * Prevents the database from going to sleep on free tier
 */
export class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 4 * 60 * 1000; // 4 minutes (Neon free tier sleeps after 5 min of inactivity)

  /**
   * Start the keep-alive service
   */
  start() {
    if (this.intervalId) {
      console.log('⚠️  Keep-alive service already running');
      return;
    }

    console.log('🔄 Starting Neon DB keep-alive service...');
    console.log(`⏰ Ping interval: ${this.CHECK_INTERVAL / 1000 / 60} minutes`);

    // Run immediately on start
    this.ping();

    // Then run periodically
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.CHECK_INTERVAL);
  }

  /**
   * Stop the keep-alive service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 Neon DB keep-alive service stopped');
    }
  }

  /**
   * Ping the database with a lightweight query
   */
  private async ping() {
    try {
      const startTime = Date.now();
      
      // Simple query to keep connection alive
      await prisma.$queryRaw`SELECT 1`;
      
      const duration = Date.now() - startTime;
      const timestamp = new Date().toISOString();
      
      console.log(`✅ [${timestamp}] Neon DB pinged successfully (${duration}ms)`);
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.error(`❌ [${timestamp}] Neon DB ping failed:`, error);
      
      // Try to reconnect
      try {
        await prisma.$connect();
        console.log('🔌 Reconnected to Neon DB');
      } catch (reconnectError) {
        console.error('❌ Failed to reconnect:', reconnectError);
      }
    }
  }

  /**
   * Get service status
   */
  isRunning(): boolean {
    return this.intervalId !== null;
  }
}

// Export singleton instance
export const keepAliveService = new KeepAliveService();
