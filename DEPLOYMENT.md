# Deployment Guide 🚀

## Quick Setup for GitHub & Vercel

### Step 1: Push to GitHub

Run the PowerShell script:
```powershell
.\deploy-to-github.ps1
```

Or manually:
```bash
# Initialize git (if not already done)
git init
git branch -M main

# Add remote
git remote add origin https://github.com/blackMaax/Weight-Gain-App.git

# Add and commit files
git add .
git commit -m "Initial commit: Weight Gain Tracker App"

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import** your `Weight-Gain-App` repository
5. **Configure** (Vercel auto-detects Next.js):
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
6. **Click "Deploy"**

That's it! Vercel will:
- Build your app
- Deploy it to a live URL
- Set up HTTPS automatically
- Enable PWA installation on the live site

### Step 3: Access Your Live App

After deployment, Vercel will give you:
- **Production URL**: `https://your-app-name.vercel.app`
- **HTTPS enabled** (required for PWA installation)
- **Automatic deployments** on every push to main branch

### Step 4: Install on Your Phone (Live Version)

Once deployed, you can install the app from the live URL:

**Android:**
1. Open the Vercel URL in Chrome
2. Tap menu → "Install app"
3. Done!

**iPhone:**
1. Open the Vercel URL in Safari
2. Tap Share → "Add to Home Screen"
3. Done!

## Environment Variables (if needed)

If you add environment variables later:
1. Go to Vercel project settings
2. Navigate to "Environment Variables"
3. Add your variables
4. Redeploy

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

Just push your changes:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically rebuild and deploy!

---

**Need help?** Check Vercel docs: https://vercel.com/docs

