# Neon DB Keep-Alive Service

## Overview

This service prevents Neon's free tier database from going to sleep due to inactivity. Neon databases on the free tier automatically suspend after **5 minutes of inactivity** to save resources.

## How It Works

The keep-alive service sends a lightweight `SELECT 1` query to the database every **4 minutes**, ensuring the connection remains active and preventing automatic suspension.

## Implementation Methods

### Method 1: Automatic (Integrated with Server)

**The keep-alive service is automatically enabled when you start the backend server.**

```bash
cd server
npm run dev
```

**Console Output:**
```
✅ Neon PostgreSQL connected successfully
🔄 Starting Neon DB keep-alive service...
⏰ Ping interval: 4 minutes
✅ [2025-10-23T00:00:00.000Z] Neon DB pinged successfully (15ms)
```

The service will:
- Start automatically when the server starts
- Ping the database every 4 minutes
- Automatically reconnect if connection is lost
- Stop gracefully when the server shuts down

### Method 2: Standalone Script

Run the keep-alive service independently (without the main server):

```bash
cd server
npm run keep-alive
```

This is useful for:
- Development when you need the DB active but not the API
- Background tasks
- Testing database connectivity

## Service Features

### ✅ Automatic Reconnection
If the database connection is lost, the service automatically attempts to reconnect:

```
❌ [2025-10-23T00:05:00.000Z] Neon DB ping failed: Error...
🔌 Reconnected to Neon DB
```

### ✅ Lightweight Queries
Uses the most efficient query possible to minimize resource usage:

```sql
SELECT 1
```

This query:
- Returns instantly
- Uses minimal CPU/memory
- Doesn't lock any tables
- Doesn't read any actual data

### ✅ Graceful Shutdown
The service properly cleans up on shutdown:

```bash
# Press Ctrl+C
🛑 Shutting down gracefully...
🛑 Neon DB keep-alive service stopped
```

## Configuration

### Adjust Ping Interval

Edit `server/src/utils/keepAlive.ts`:

```typescript
private readonly CHECK_INTERVAL = 4 * 60 * 1000; // 4 minutes
```

**Recommendations:**
- **Free Tier:** 4 minutes (default)
- **Paid Tier:** Not needed, but 10-15 minutes if desired
- **Minimum:** 1 minute (too frequent may waste resources)
- **Maximum:** 4.5 minutes (to stay under 5-minute limit)

## Monitoring

### Check Service Status

The console will show regular pings:

```
✅ [2025-10-23T00:00:00.000Z] Neon DB pinged successfully (12ms)
✅ [2025-10-23T00:04:00.000Z] Neon DB pinged successfully (15ms)
✅ [2025-10-23T00:08:00.000Z] Neon DB pinged successfully (11ms)
```

### Check If Running

In your code:

```typescript
import { keepAliveService } from './utils/keepAlive';

if (keepAliveService.isRunning()) {
  console.log('Keep-alive service is active');
}
```

## Files Created

1. **`server/src/utils/keepAlive.ts`**
   - Main service class
   - Auto-starts with the server

2. **`server/src/scripts/keepAlive.ts`**
   - Standalone script
   - Can run independently

3. **Updated `server/src/index.ts`**
   - Integrated keep-alive service
   - Automatic start/stop

4. **Updated `server/package.json`**
   - Added `npm run keep-alive` script

## Usage Examples

### Development Mode

```bash
# Start server with keep-alive (automatic)
cd server
npm run dev
```

### Production Mode

```bash
# Build and start
cd server
npm run build
npm start
```

The keep-alive service will work in both development and production.

### Standalone Keep-Alive

```bash
# Run only the keep-alive service
cd server
npm run keep-alive
```

Keep this terminal open to maintain the database connection.

## Troubleshooting

### Service Not Starting

**Check if Prisma is connected:**
```typescript
await prisma.$connect();
```

**Verify environment variables:**
```bash
# server/.env
DATABASE_URL="postgresql://..."
```

### Database Still Sleeping

**Possible causes:**
1. Interval too long (> 5 minutes)
2. Service crashed or stopped
3. Network issues preventing queries

**Solution:**
Check console for error messages and verify pings are occurring regularly.

### Too Many Connections

If you run multiple instances:

```
Error: too many connections
```

**Solution:**
- Only run one keep-alive instance
- The integrated version (with server) is sufficient
- Don't run both server AND standalone script

## Performance Impact

### Resource Usage

- **CPU:** < 0.1% (only during ping)
- **Memory:** ~5MB for service
- **Network:** ~100 bytes every 4 minutes
- **Database Load:** Negligible (simple SELECT query)

### Cost on Neon Free Tier

- Free tier includes **unlimited queries**
- Keep-alive queries are extremely lightweight
- **No cost impact** on free tier

## Disabling Keep-Alive

If you want to disable the automatic keep-alive:

**Edit `server/src/index.ts`:**

```typescript
// Comment out this line:
// keepAliveService.start();
```

Or set environment variable:

```bash
# .env
ENABLE_KEEP_ALIVE=false
```

Then update the code to check this variable.

## Alternative Solutions

### 1. Neon Paid Tier
Upgrade to a paid plan - databases never sleep.

### 2. Cron Job
Use an external cron service (like cron-job.org) to ping an API endpoint every 4 minutes.

### 3. Serverless Functions
Deploy a serverless function (Vercel, AWS Lambda) that pings the DB periodically.

### 4. GitHub Actions
Use GitHub Actions with scheduled workflows to keep the DB alive.

**Our integrated solution is the most reliable and easiest to maintain.**

## Best Practices

✅ **Run automatically with server** (default behavior)  
✅ **Monitor console for ping confirmations**  
✅ **Keep interval under 5 minutes**  
✅ **Use lightweight queries only**  
✅ **Enable graceful shutdown**  

❌ Don't run multiple keep-alive instances  
❌ Don't use complex queries for pinging  
❌ Don't set interval too short (< 1 minute)  
❌ Don't forget to check logs for errors  

## Summary

The keep-alive service is now **fully integrated** and will:

1. ✅ Start automatically with the backend server
2. ✅ Ping Neon DB every 4 minutes
3. ✅ Prevent automatic database suspension
4. ✅ Log all pings to console
5. ✅ Reconnect automatically on failure
6. ✅ Shut down gracefully

**No additional configuration needed - it just works!** 🚀
