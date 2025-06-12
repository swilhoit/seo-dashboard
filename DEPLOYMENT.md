# Deployment Guide

## Railway Deployment

### Quick Deploy

1. **Fork this repository** to your GitHub account

2. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your forked repository

3. **Set Environment Variables:**
   In Railway dashboard, go to Variables tab and add:
   ```
   DATAFORSEO_USERNAME=your_dataforseo_username
   DATAFORSEO_PASSWORD=your_dataforseo_password
   PORT=8000
   DEBUG=false
   ```

4. **Deploy:**
   Railway will automatically build and deploy your app using the configuration files.

### Manual Configuration

If automatic deployment doesn't work, try these settings in Railway:

- **Build Command:** `cd backend && pip install -r requirements.txt`
- **Start Command:** `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT`
- **Root Directory:** `/`

## Vercel Deployment (Frontend Only)

For frontend deployment on Vercel:

1. **Deploy Frontend:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build settings:
     - Framework: React
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`

2. **Environment Variables:**
   Add to Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.com/api
   ```

## Environment Variables

Required environment variables:

- `DATAFORSEO_USERNAME` - Your DataForSEO API username
- `DATAFORSEO_PASSWORD` - Your DataForSEO API password
- `PORT` - Port for the backend (default: 8000)
- `DEBUG` - Set to `false` for production

## Troubleshooting

### Railway Issues:
- Make sure requirements.txt is in the root directory
- Verify environment variables are set correctly
- Check logs for specific error messages

### Vercel Issues:
- Ensure backend URL is correct in frontend environment variables
- Check CORS settings if getting connection errors

## Architecture

- **Frontend:** React app deployed on Vercel
- **Backend:** Flask API deployed on Railway
- **API:** DataForSEO for SEO data