# 🚀 Backend Deployment Guide - Vercel

## Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- Neon PostgreSQL database with connection string
- GitHub/GitLab account (optional, for auto-deployments)

## Step 1: Prepare Environment Variables

Your backend needs these environment variables on Vercel:

```bash
DATABASE_URL="your-neon-postgres-connection-string"
JWT_SECRET="your-secure-jwt-secret-key"
NODE_ENV="production"
CLIENT_URL="https://your-frontend-url.vercel.app"
```

## Step 2: Deploy Backend to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel:**
```bash
cd server
vercel login
```

2. **Deploy (first time):**
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name: `secretlease-backend` (or your choice)
- Directory: `./` (current directory)
- Override settings? **N**

3. **Add Environment Variables:**

After initial deployment, add environment variables:

```bash
vercel env add DATABASE_URL
# Paste your Neon connection string

vercel env add JWT_SECRET
# Enter a secure random string

vercel env add NODE_ENV
# Enter: production

vercel env add CLIENT_URL
# Leave empty for now (will add after frontend deployment)
```

4. **Deploy to Production:**
```bash
vercel --prod
```

5. **Copy the Production URL** (e.g., `https://secretlease-backend.vercel.app`)

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: Leave empty
5. Add Environment Variables (same as above)
6. Click "Deploy"

## Step 3: Verify Deployment

Test your backend API:

```bash
curl https://your-backend-url.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "SecretLease API is running"
}
```

## Step 4: Update Frontend Configuration

After backend is deployed, update the frontend:

1. Edit `c:\Users\Cactus I0I\Downloads\secretlease-admin-panel\.env`:
```bash
VITE_API_URL=https://your-backend-url.vercel.app
```

2. The frontend will now connect to your production backend

## Troubleshooting

### Issue: Database connection fails
- Verify `DATABASE_URL` is set correctly in Vercel environment variables
- Check Neon DB is active and accessible

### Issue: CORS errors
- Add your frontend URL to `CLIENT_URL` environment variable
- Redeploy after adding the variable

### Issue: Prisma errors
- Ensure `vercel-build` script runs successfully
- Check build logs in Vercel dashboard

## Important Notes

✅ **Database Migrations**: The `vercel-build` script automatically runs `prisma db push`

✅ **Serverless Optimization**: Keep-alive service is disabled on Vercel (not needed for serverless)

✅ **Environment Variables**: Always use Vercel environment variables, never commit `.env` files

✅ **CORS**: Frontend URL is pre-configured in allowed origins

## Next Steps

After backend deployment:
1. ✅ Copy the production URL
2. ⏭️ Configure frontend to use this URL
3. ⏭️ Deploy frontend to Vercel
4. ⏭️ Update backend `CLIENT_URL` with frontend URL
