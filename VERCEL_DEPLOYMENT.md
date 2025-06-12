# Vercel Deployment Guide

## The Issue
Vercel is trying to deploy the entire repository as a React app, but needs to be configured to only deploy the frontend directory.

## Solution: Configure Vercel Project Settings

### Step 1: Create New Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository: `swilhoit/seo-dashboard`

### Step 2: Configure Build Settings

In the Vercel project configuration, set these **EXACT** settings:

**Framework Preset:** `Create React App`

**Root Directory:** `frontend`

**Build Command:** `npm run build` (should auto-fill)

**Output Directory:** `build` (should auto-fill)

**Install Command:** `npm install` (should auto-fill)

### Step 3: Set Environment Variables

In Vercel dashboard → Project → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-railway-app-url.railway.app
```

**Get your Railway URL:**
1. Go to your Railway dashboard
2. Click on your seo-dashboard project  
3. Copy the domain URL (something like `https://capable-flexibility-production.up.railway.app`)
4. Use that URL (without /api at the end)

### Step 4: Deploy

1. Click "Deploy" in Vercel
2. Vercel will now only build the `frontend` directory
3. Should successfully deploy React app

## Manual Configuration (If Above Doesn't Work)

If the GUI configuration doesn't work, you can override with these settings:

**Build Command:** `cd frontend && npm install && npm run build`

**Output Directory:** `frontend/build`

**Install Command:** `cd frontend && npm install`

## Troubleshooting

### Common Issues:

1. **"No package.json found"**
   - Make sure Root Directory is set to `frontend`

2. **"API calls failing"**
   - Check that REACT_APP_API_URL points to your Railway app
   - Make sure Railway app is running and accessible

3. **"Blank page after deployment"**
   - Check browser console for errors
   - Verify the build completed successfully in Vercel logs

4. **"Route not found" errors**
   - The vercel.json file handles React Router routing
   - Make sure vercel.json is in the root directory

### Testing Your Deployment:

1. **Frontend loads:** Visit your Vercel URL
2. **Railway API works:** Visit `https://your-railway-app.railway.app/ping`
3. **Connection works:** Try using the keyword research feature

## Expected Result

- **Frontend:** Deployed on Vercel (React app)
- **Backend:** Deployed on Railway (Python API)  
- **Connection:** Frontend makes API calls to Railway backend
- **Complete SEO Dashboard:** All features working together