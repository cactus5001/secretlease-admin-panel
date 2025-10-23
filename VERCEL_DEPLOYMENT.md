# 🚀 Complete Vercel Deployment Guide - SecretLease Platform

This guide walks you through deploying both the backend and frontend to Vercel.

## 📋 Prerequisites

- [x] Vercel account ([sign up free](https://vercel.com/signup))
- [x] Vercel CLI installed: `npm i -g vercel`
- [x] Neon PostgreSQL database connection string
- [x] Git repository (optional but recommended)

---

## Part 1: Deploy Backend 🔧

### Step 1: Login to Vercel

```bash
vercel login
```

Follow the browser prompt to authenticate.

### Step 2: Navigate to Backend Directory

```bash
cd server
```

### Step 3: Deploy Backend (Initial)

```bash
vercel
```

You'll be prompted with:

```
? Set up and deploy "~/secretlease-admin-panel/server"? [Y/n] Y
? Which scope do you want to deploy to? <Select your account>
? Link to existing project? [y/N] N
? What's your project's name? secretlease-backend
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Important**: Copy the deployment URL shown (e.g., `https://secretlease-backend-xxxxx.vercel.app`)

### Step 4: Add Environment Variables

Add these environment variables to your Vercel project:

```bash
# Database connection string
vercel env add DATABASE_URL production
# Paste your Neon connection string when prompted
# Example: postgresql://user:pass@host.neon.tech/dbname?sslmode=require

# JWT secret (use a secure random string)
vercel env add JWT_SECRET production
# Enter a secure random string (at least 32 characters)

# Node environment
vercel env add NODE_ENV production
# Enter: production

# Client URL (will update after frontend deployment)
vercel env add CLIENT_URL production
# Press Enter to skip for now (we'll add this later)
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

**✅ Copy your production URL**: `https://secretlease-backend.vercel.app`

### Step 6: Test Backend API

```bash
curl https://YOUR-BACKEND-URL.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "SecretLease API is running"
}
```

---

## Part 2: Configure Frontend for Production 🎨

### Step 1: Update Frontend Environment

Navigate back to the frontend directory:

```bash
cd ..
```

Edit `.env` file:

```bash
VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
```

Replace `YOUR-BACKEND-URL` with your actual backend URL from Part 1, Step 5.

Example:
```bash
VITE_API_URL=https://secretlease-backend.vercel.app/api
```

### Step 2: Test Frontend with Production Backend (Optional)

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- Login works
- Signup works
- Admin panel loads
- No CORS errors in console

---

## Part 3: Deploy Frontend 🌐

### Step 1: Deploy Frontend (Initial)

```bash
vercel
```

You'll be prompted with:

```
? Set up and deploy "~/secretlease-admin-panel"? [Y/n] Y
? Which scope do you want to deploy to? <Select your account>
? Link to existing project? [y/N] N
? What's your project's name? secretlease-frontend
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

### Step 2: Add Frontend Environment Variable

```bash
# API URL pointing to your backend
vercel env add VITE_API_URL production
# Enter: https://YOUR-BACKEND-URL.vercel.app/api
```

### Step 3: Deploy Frontend to Production

```bash
vercel --prod
```

**✅ Copy your frontend production URL**: `https://secretlease-frontend.vercel.app`

---

## Part 4: Update Backend CORS 🔄

Now that we have the frontend URL, we need to update the backend to allow requests from it.

### Step 1: Add Frontend URL to Backend

```bash
cd server
vercel env add CLIENT_URL production
# Enter: https://YOUR-FRONTEND-URL.vercel.app
```

### Step 2: Redeploy Backend

```bash
vercel --prod
```

This redeploys the backend with the updated CORS settings.

---

## Part 5: Verification & Testing ✅

### Test the Complete Flow

1. **Open your frontend URL**: `https://YOUR-FRONTEND-URL.vercel.app`

2. **Test Login**:
   - Email: `admin@secretlease.com`
   - Password: `admin123`

3. **Test Signup**:
   - Create a new account with payment details
   - Verify it appears in admin panel

4. **Test Admin Approval**:
   - Go to "Pending Signups"
   - Approve or reject a user

5. **Check for Errors**:
   - Open browser console (F12)
   - Look for any red errors
   - Verify API calls succeed

---

## 🎯 Quick Reference

### Backend URLs
- **Development**: `http://localhost:5000`
- **Production**: `https://YOUR-BACKEND-URL.vercel.app`
- **Health Check**: `/api/health`

### Frontend URLs
- **Development**: `http://localhost:3000`
- **Production**: `https://YOUR-FRONTEND-URL.vercel.app`

### Common Commands

```bash
# Deploy backend to production
cd server && vercel --prod

# Deploy frontend to production
cd .. && vercel --prod

# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Remove deployment
vercel remove <deployment-url>
```

---

## 🔧 Troubleshooting

### Issue: CORS Errors

**Symptom**: "Access to fetch has been blocked by CORS policy"

**Solution**:
1. Verify `CLIENT_URL` is set correctly in backend
2. Check it matches your frontend URL exactly
3. Redeploy backend: `cd server && vercel --prod`

### Issue: Database Connection Failed

**Symptom**: "Error connecting to database"

**Solution**:
1. Verify `DATABASE_URL` in backend environment variables
2. Test connection string in Neon dashboard
3. Ensure Neon database is active

### Issue: Environment Variables Not Working

**Symptom**: Variables showing as undefined

**Solution**:
1. List environment variables: `vercel env ls`
2. Ensure they're set for "Production"
3. Redeploy after adding variables

### Issue: Build Fails

**Symptom**: Deployment fails during build

**Solution**:
1. Check build logs: `vercel logs`
2. Test build locally: `npm run build`
3. Fix any TypeScript errors shown

---

## 🎉 Success Checklist

- [x] Backend deployed to Vercel
- [x] Backend health check returns 200 OK
- [x] All backend environment variables configured
- [x] Frontend deployed to Vercel
- [x] Frontend environment variable set
- [x] Backend CORS updated with frontend URL
- [x] Login works on production
- [x] Signup works on production
- [x] Admin panel accessible
- [x] No console errors

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🚀 Auto-Deployments (Optional)

For automatic deployments on every git push:

1. Connect your GitHub repository to Vercel
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your repository
5. Configure settings as above
6. Every push to `main` branch will auto-deploy!

---

**Need help?** Check the troubleshooting section or review Vercel deployment logs.
