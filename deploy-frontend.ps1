# ======================================
# FRONTEND DEPLOYMENT SCRIPT
# ======================================

Write-Host "`n🚀 SECRETLEASE FRONTEND DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=================================`n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "📁 Current directory: $(Get-Location)`n" -ForegroundColor Gray

# Ask user for deployment type
Write-Host "Select deployment option:" -ForegroundColor Yellow
Write-Host "1. Initial deployment (first time)" -ForegroundColor White
Write-Host "2. Deploy to production (existing project)" -ForegroundColor White
Write-Host "3. Update environment variable (API URL)" -ForegroundColor White
$choice = Read-Host "`nEnter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n🔨 Starting initial deployment...`n" -ForegroundColor Green
        vercel
        
        Write-Host "`n✅ Initial deployment complete!" -ForegroundColor Green
        Write-Host "`n⚠️  IMPORTANT: Copy the deployment URL shown above" -ForegroundColor Yellow
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Run this script again and select option 3 to add API URL" -ForegroundColor White
        Write-Host "2. Then select option 2 to deploy to production`n" -ForegroundColor White
    }
    "2" {
        Write-Host "`n🚀 Deploying to production...`n" -ForegroundColor Green
        vercel --prod
        
        Write-Host "`n✅ Production deployment complete!" -ForegroundColor Green
        Write-Host "Your frontend is now live!`n" -ForegroundColor Cyan
        Write-Host "Don't forget to update backend CLIENT_URL with this frontend URL!`n" -ForegroundColor Yellow
    }
    "3" {
        Write-Host "`n🔐 Setting API URL environment variable...`n" -ForegroundColor Green
        Write-Host "Enter your backend API URL (e.g., https://secretlease-backend.vercel.app/api):" -ForegroundColor Cyan
        $apiUrl = Read-Host
        
        if ($apiUrl) {
            # Remove existing if present
            Write-Host "`nRemoving existing VITE_API_URL (if any)..." -ForegroundColor Gray
            vercel env rm VITE_API_URL production --yes 2>$null
            
            # Add new value
            Write-Host "Adding new VITE_API_URL..." -ForegroundColor Cyan
            echo $apiUrl | vercel env add VITE_API_URL production
            
            Write-Host "`n✅ Environment variable set!" -ForegroundColor Green
            Write-Host "Run this script again and select option 2 to deploy to production`n" -ForegroundColor Yellow
        } else {
            Write-Host "`n❌ No URL provided. Exiting.`n" -ForegroundColor Red
        }
    }
    default {
        Write-Host "`n❌ Invalid choice. Exiting.`n" -ForegroundColor Red
        exit
    }
}

Write-Host "`n📊 Deployment complete!" -ForegroundColor Green
Write-Host "Check your deployment at: https://vercel.com/dashboard`n" -ForegroundColor Cyan
