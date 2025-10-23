# ======================================
# ADD ENVIRONMENT VARIABLES TO VERCEL
# ======================================

Write-Host "`n🔐 Adding Environment Variables to Vercel" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# DATABASE_URL
Write-Host "Adding DATABASE_URL..." -ForegroundColor Yellow
$dbUrl = "postgresql://neondb_owner:npg_mxKZSza18dVL@ep-twilight-glade-a4wqya0z-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo $dbUrl | vercel env add DATABASE_URL production

Write-Host "`n✅ DATABASE_URL added!`n" -ForegroundColor Green

# JWT_SECRET
Write-Host "Adding JWT_SECRET..." -ForegroundColor Yellow
$jwtSecret = "secretlease-super-secure-jwt-secret-key-2025-production-v1"
echo $jwtSecret | vercel env add JWT_SECRET production

Write-Host "`n✅ JWT_SECRET added!`n" -ForegroundColor Green

# NODE_ENV
Write-Host "Adding NODE_ENV..." -ForegroundColor Yellow
echo "production" | vercel env add NODE_ENV production

Write-Host "`n✅ NODE_ENV added!`n" -ForegroundColor Green

# CLIENT_URL (empty for now)
Write-Host "Adding CLIENT_URL (empty for now, will update after frontend deployment)..." -ForegroundColor Yellow
echo "" | vercel env add CLIENT_URL production

Write-Host "`n✅ CLIENT_URL added (empty)!`n" -ForegroundColor Green

Write-Host "`n🎉 All environment variables added successfully!" -ForegroundColor Green
Write-Host "`nNext step: Deploy to production with 'vercel --prod'`n" -ForegroundColor Cyan
