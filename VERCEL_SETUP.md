# Vercel Auto-Deploy Setup

## Issue: Vercel not auto-deploying on push

If Vercel isn't auto-deploying when you push to GitHub, check these settings:

## Step 1: Verify GitHub Integration

1. Go to Vercel Dashboard → Your Project → **Settings** → **Git**
2. Check that:
   - **Production Branch**: `main` (or `master`)
   - **Git Repository**: Should show `blackMaax/Weight-Gain-App`
   - **Auto-deploy**: Should be **ON**

## Step 2: Reconnect Repository (if needed)

1. Go to **Settings** → **Git**
2. Click **Disconnect** (if connected)
3. Click **Connect Git Repository**
4. Select **GitHub**
5. Find and select `Weight-Gain-App`
6. Click **Import**

## Step 3: Verify Branch Settings

1. Go to **Settings** → **Git**
2. Under **Production Branch**, make sure it says `main`
3. If it says `master`, change it to `main`

## Step 4: Check Webhook (if still not working)

1. Go to your GitHub repo: https://github.com/blackMaax/Weight-Gain-App
2. Go to **Settings** → **Webhooks**
3. Look for a Vercel webhook
4. If missing, Vercel should create it automatically when you reconnect

## Step 5: Manual Trigger (to test)

1. In Vercel Dashboard → **Deployments**
2. Click **Create Deployment**
3. Select your branch (`main`)
4. Click **Deploy**

If this works, the auto-deploy should work too after reconnecting.

## Step 6: Force a New Deployment

Make a small change and push:

```bash
# Make a small change
echo "# Weight Gain App" > .vercel-test
git add .vercel-test
git commit -m "Trigger Vercel deployment"
git push origin main
```

Then delete the test file:
```bash
git rm .vercel-test
git commit -m "Remove test file"
git push origin main
```

---

**Most Common Fix**: Reconnect the repository in Vercel Settings → Git

