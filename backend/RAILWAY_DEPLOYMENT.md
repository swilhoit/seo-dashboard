# Railway Deployment Guide for SEO Dashboard Backend

This guide explains how to deploy the SEO Dashboard backend to Railway.

## Prerequisites

- A [Railway](https://railway.app/) account
- Git repository with your code (GitHub recommended)

## Deployment Steps

1. **Push your code to GitHub**

   Make sure your code is in a GitHub repository.

2. **Log in to Railway**

   Go to [Railway](https://railway.app/) and log in with your GitHub account.

3. **Create a new project**

   Click "New Project" and select "Deploy from GitHub repo".

4. **Configure your project**

   - Select your repository
   - Railway will detect this is a Python project
   - Set the following environment variables:
     - `PORT`: `5001` (or your preferred port)
     - Any API keys or credentials your app needs (e.g., DataForSEO credentials)

5. **Deploy**

   Railway will automatically deploy your app. Once completed, you'll get a URL for your API.

6. **Configure CORS (if needed)**

   If your frontend is hosted elsewhere (e.g., Vercel), make sure to update the CORS settings in `app.py` to allow requests from your frontend domain.

## Connecting Frontend to Backend

Update your frontend API base URL to point to your Railway backend URL:

```typescript
// Example in src/config.ts or similar
export const API_BASE_URL = "https://your-railway-app-url.railway.app";
```

## Troubleshooting

- **Deployment Fails**: Check the build logs for errors
- **API Not Responding**: Verify environment variables are set correctly
- **CORS Errors**: Ensure your Flask app's CORS settings include your frontend domain

## Monitoring

Railway provides logs and metrics for your application. Access these from your project dashboard.
