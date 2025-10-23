# ======================================
# BACKEND DEPLOYMENT SCRIPT
# ======================================

Write-Host "`n🚀 SECRETLEASE BACKEND DEPLOYMENT" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Navigate to server directory
Set-Location -Path "server"

Write-Host "📁 Current directory: $(Get-Location)`n" -ForegroundColor Gray

# Ask user for deployment type
Write-Host "Select deployment option:" -ForegroundColor Yellow
Write-Host "1. Initial deployment (first time)" -ForegroundColor White
Write-Host "2. Deploy to production (existing project)" -ForegroundColor White
Write-Host "3. Add environment variables" -ForegroundColor White
$choice = Read-Host "`nEnter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n🔨 Starting initial deployment...`n" -ForegroundColor Green
        vercel
        
        Write-Host "`n✅ Initial deployment complete!" -ForegroundColor Green
        Write-Host "`n⚠️  IMPORTANT: Copy the deployment URL shown above" -ForegroundColor Yellow
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Run this script again and select option 3 to add environment variables" -ForegroundColor White
        Write-Host "2. Then select option 2 to deploy to production`n" -ForegroundColor White
    }
    "2" {
        Write-Host "`n🚀 Deploying to production...`n" -ForegroundColor Green
        vercel --prod
        
        Write-Host "`n✅ Production deployment complete!" -ForegroundColor Green
        Write-Host "Your backend API is now live!`n" -ForegroundColor Cyan
    }
    "3" {
        Write-Host "`n🔐 Adding environment variables...`n" -ForegroundColor Green
        
        Write-Host "Adding DATABASE_URL..." -ForegroundColor Cyan
        vercel env add DATABASE_URL production
        
        Write-Host "`nAdding JWT_SECRET..." -ForegroundColor Cyan
        vercel env add JWT_SECRET production
        
        Write-Host "`nAdding NODE_ENV..." -ForegroundColor Cyan
        vercel env add NODE_ENV production
        
        Write-Host "`nAdding CLIENT_URL (optional - press Enter to skip)..." -ForegroundColor Cyan
        vercel env add CLIENT_URL production
        
        Write-Host "`n✅ Environment variables added!" -ForegroundColor Green
        Write-Host "Run this script again and select option 2 to deploy to production`n" -ForegroundColor Yellow
    }
    default {
        Write-Host "`n❌ Invalid choice. Exiting.`n" -ForegroundColor Red
        exit
    }
}

# Return to root directory
Set-Location -Path ".."

Write-Host "`n📊 Deployment complete!" -ForegroundColor Green
Write-Host "Check your deployment at: https://vercel.com/dashboard`n" -ForegroundColor Cyan
