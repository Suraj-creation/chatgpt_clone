# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

Your repository is now **Vercel-ready**! All necessary files have been pushed to GitHub.

## 🚀 Deploy to Vercel

### Option 1: Import from GitHub (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Repository**
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Choose `Suraj-creation/chatgpt_clone`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
   - **Node Version**: 20.x (configured in package.json)

4. **Add Environment Variables** ⚠️ **CRITICAL STEP**
   
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `GEMINI_API_KEY` | `AIzaSyAGwcFcTu4PAdl00yf6S3Ty2SuCtqlWTTE` |
   | `NEXT_PUBLIC_APP_NAME` | `Gemini Chat` |
   
   **Important**: 
   - Select which environments: ✅ Production, ✅ Preview, ✅ Development
   - Make sure you check all three environment types

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://chatgpt-clone-xxx.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd c:\Users\Govin\Desktop\Ravichandra
vercel

# Follow prompts:
# - Setup and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N
# - Project name? chatgpt_clone (or your choice)
# - Directory? ./ (press Enter)
# - Override settings? N

# Add environment variables
vercel env add GEMINI_API_KEY
# Paste: AIzaSyAGwcFcTu4PAdl00yf6S3Ty2SuCtqlWTTE
# Select: Production, Preview, Development (all)

# Deploy to production
vercel --prod
```

## 🔍 Troubleshooting Common Issues

### Build Failed

**Issue**: Build fails with TypeScript errors
**Solution**: 
```bash
npm run type-check
npm run build
```
If successful locally, check Vercel build logs for specific errors.

**Issue**: Module not found errors
**Solution**: Ensure all dependencies are in `package.json` (not devDependencies for production needs)

### Environment Variables Not Working

**Issue**: API returns "GEMINI_API_KEY is not configured"
**Solution**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `GEMINI_API_KEY` exists with correct value
3. Ensure it's enabled for Production environment
4. **Redeploy** after adding env vars: Deployments → Latest → Redeploy

**Issue**: Getting 401/403 errors from Gemini API
**Solution**:
1. Verify API key is correct: `AIzaSyAGwcFcTu4PAdl00yf6S3Ty2SuCtqlWTTE`
2. Check API key hasn't expired at: https://makersuite.google.com/app/apikey
3. Ensure API key has proper permissions

### 404 Deployment Not Found

**Issue**: `404: NOT_FOUND - DEPLOYMENT_NOT_FOUND`
**Solution**: This is usually a Vercel routing issue. Try:
1. Delete the project in Vercel Dashboard
2. Re-import from GitHub
3. Ensure vercel.json exists (✅ already added)
4. Make sure Node version is 20.x (✅ already set)

### Performance Issues

**Issue**: Slow response times
**Solution**:
1. Check Vercel region matches your users (default is US East)
2. Consider upgrading Vercel plan for better performance
3. Implement response caching if needed

## 📋 Post-Deployment Checklist

- [ ] Visit deployed URL and test basic chat functionality
- [ ] Test with different message types (short, long, code, lists)
- [ ] Verify theme switching works (light/dark)
- [ ] Test settings panel (font size, message width, etc.)
- [ ] Check resizable sidebar functionality
- [ ] Test on mobile device/responsive view
- [ ] Monitor Vercel Analytics for errors
- [ ] Check Vercel Function Logs for API errors

## 🔐 Security Notes

### ✅ What's Protected
- `.env.local` is gitignored (not in repository)
- `node_modules` is gitignored (Vercel installs fresh)
- API key is stored in Vercel environment variables (encrypted)

### ⚠️ Important Reminders
- **Never commit `.env.local`** to git
- **Rotate API key** if accidentally exposed
- **Monitor API usage** at Google Cloud Console
- **Set up billing alerts** to avoid unexpected charges

## 🎯 Production URL

After deployment, your app will be available at:
- **Production**: `https://chatgpt-clone-xxx.vercel.app` (or custom domain)
- **Preview**: Automatic preview URLs for each PR/branch
- **Development**: Local testing at `http://localhost:3000`

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- **Push to `main`** → Production deployment
- **Push to other branch** → Preview deployment
- **Pull Request** → Preview deployment with unique URL

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: View deployment history and logs
- **Analytics**: Track usage and performance (requires pro plan)
- **Logs**: Real-time function logs for debugging

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs [deployment-url]
```

## 🆘 Need Help?

1. **Vercel Docs**: https://vercel.com/docs
2. **Next.js Docs**: https://nextjs.org/docs
3. **Gemini API Docs**: https://ai.google.dev/docs
4. **Check GitHub Issues**: Look for similar deployment issues

## 📝 Configuration Files

### ✅ Already Configured
- `package.json` - Build scripts and Node version (20.x)
- `next.config.js` - Next.js configuration
- `vercel.json` - Vercel-specific settings
- `.gitignore` - Excludes node_modules, .env, build artifacts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration

All files are committed and pushed to GitHub. You're ready to deploy! 🚀

---

**Quick Deploy**: Just click "Import" in Vercel Dashboard and add the `GEMINI_API_KEY` environment variable!
