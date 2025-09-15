# Deployment Guide

This guide covers deploying the Spaces by FanPit application with the backend on Render and frontend on Vercel.

## Prerequisites

1. GitHub repository with your code
2. MongoDB Atlas account (for production database)
3. Render account
4. Vercel account

## Backend Deployment (Render)

### 1. Environment Variables

Set these environment variables in your Render dashboard:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_change_in_production
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://spaces-by-fan-pit-htdn.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Optional (leave empty to disable Razorpay):
```
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### 2. Deploy to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - **Root Directory**: `./backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment**: Node
   - **Region**: Choose closest to your users

The `render.yaml` file is already configured for automatic deployment.

## Frontend Deployment (Vercel)

### 1. Environment Variables Setup

In your Vercel dashboard, set the following environment variables:

```
NEXT_PUBLIC_API_BASE=https://spaces-by-fanpit-x3kc.onrender.com/api
NODE_ENV=production
```

Optional (if using Razorpay):
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_public_key
```

### 2. Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Import your project
3. Use the following settings:
   - **Root Directory**: `./frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. In Environment Variables section, add:
   - `NEXT_PUBLIC_API_BASE` = `https://your-render-app.onrender.com/api`
5. Deploy!

The `vercel.json` file is already configured for optimal deployment.

## Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your Render IP addresses (or use 0.0.0.0/0 for all IPs)
4. Get your connection string and add it to Render environment variables

## Post-Deployment Steps

1. Update CORS settings in backend to include your Vercel domain
2. Test all API endpoints
3. Verify authentication flow works
4. Test space creation and booking functionality

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure FRONTEND_URL is set correctly in Render
2. **Database Connection**: Verify MongoDB URI and network access
3. **Environment Variables**: Double-check all required env vars are set
4. **Build Failures**: Check logs in Render/Vercel dashboards

### Logs:

- **Render**: Check the logs tab in your service dashboard
- **Vercel**: Check the Functions tab for serverless function logs

## Monitoring

- Set up health checks using the `/api/health` endpoint
- Monitor application performance in Render/Vercel dashboards
- Set up error tracking (recommended: Sentry)

## Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets
- Regularly rotate API keys
- Keep dependencies updated
