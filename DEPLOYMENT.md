# Deployment Guide

## Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with your code pushed to a repository
- Vercel account (free tier available at vercel.com)
- Your Gemini API key ready

### Step-by-Step Instructions

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "Add New" → "Project"
   - Find your `chatgpt_clone` repository
   - Click "Import"

3. **Configure Environment Variables** ⚠️ CRITICAL STEP
   - Before deploying, click "Environment Variables"
   - Add the following variable:
     ```
     Name: GEMINI_API_KEY
     Value: AIzaSyBoW7RSSIa5ahtsU1mPZEeiDgIOJjNeGGM
     ```
   - Select all environments (Production, Preview, Development)
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-project.vercel.app`

### After Deployment

If you see "GEMINI_API_KEY is not configured" error:

1. Go to your Vercel Dashboard
2. Select your project
3. Navigate to: Settings → Environment Variables
4. Verify GEMINI_API_KEY is added with the correct value
5. Go to Deployments tab
6. Click the ⋯ menu on the latest deployment
7. Select "Redeploy"

### Troubleshooting

**Error: Node.js version warning**
- Fixed in package.json with `"node": "18.x"`
- No action needed

**Error: API not responding**
- Check environment variables in Vercel Dashboard
- Ensure GEMINI_API_KEY is set for all environments
- Trigger a new deployment after adding the variable

**Build Errors**
- Check the build logs in Vercel
- Common issue: Missing dependencies → Run `npm install` locally first
- Check for TypeScript errors → Run `npm run build` locally

## Alternative: Deploy to Netlify

1. **Go to Netlify**
   - Visit https://netlify.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repo

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     ```
     GEMINI_API_KEY=AIzaSyBoW7RSSIa5ahtsU1mPZEeiDgIOJjNeGGM
     ```

5. **Deploy**
   - Click "Deploy site"

## Alternative: Deploy to Railway

1. **Go to Railway**
   - Visit https://railway.app
   - Sign in with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Environment Variables**
   - Go to Variables tab
   - Add:
     ```
     GEMINI_API_KEY=AIzaSyBoW7RSSIa5ahtsU1mPZEeiDgIOJjNeGGM
     ```

4. **Deploy**
   - Railway will automatically deploy
   - Get your URL from the deployment

## Alternative: Deploy to Render

1. **Go to Render**
   - Visit https://render.com
   - Sign up/Sign in

2. **New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure**
   - Name: chatgpt-clone
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Environment Variables**
   - Add:
     ```
     GEMINI_API_KEY=AIzaSyBoW7RSSIa5ahtsU1mPZEeiDgIOJjNeGGM
     ```

5. **Deploy**
   - Click "Create Web Service"

## Post-Deployment Checklist

- [ ] Environment variable GEMINI_API_KEY is set
- [ ] Application loads without errors
- [ ] Can send messages and receive responses
- [ ] Chat history persists in localStorage
- [ ] Dark theme displays correctly
- [ ] Mobile responsive layout works

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit your `.env.local` file to GitHub
- The `.gitignore` file should always include `.env*.local`
- Keep your Gemini API key secure
- Consider implementing rate limiting in production
- Set up proper CORS policies for production use

## Need Help?

If you encounter issues:
1. Check Vercel/Netlify/Railway logs
2. Verify environment variables are set correctly
3. Run `npm run build` locally to check for build errors
4. Check the browser console for client-side errors
5. Review the API route logs in your deployment platform

## Updating Your Deployment

To push new changes:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Your deployment platform will automatically rebuild and redeploy.
