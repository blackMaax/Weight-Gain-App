# How to Install the App on Your Phone 📱

Your app is now set up as a Progressive Web App (PWA), which means you can install it on your phone like a native app!

## Step 1: Start the Development Server

Make sure your app is running:

```bash
npm run dev
```

or

```bash
pnpm dev
```

## Step 2: Access on Your Phone

### Option A: Same WiFi Network (Recommended)

1. Make sure your phone and computer are on the **same WiFi network**
2. Find your computer's IP address:
   - Windows: Open PowerShell and run `ipconfig | findstr IPv4`
   - Copy the IP address (e.g., `192.168.1.100`)
3. On your phone, open a browser (Chrome on Android, Safari on iPhone)
4. Go to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

### Option B: Use Your Phone's Hotspot

1. Turn on your phone's hotspot
2. Connect your computer to the hotspot
3. Get the computer's IP from the hotspot network
4. Access from your phone using that IP

## Step 3: Install the App

### On Android (Chrome):

1. Open the app in Chrome browser
2. Look for an **"Install"** or **"Add to Home Screen"** prompt at the bottom
3. If you don't see it:
   - Tap the **menu** (3 dots) in the top right
   - Select **"Install app"** or **"Add to Home Screen"**
4. Tap **"Install"** or **"Add"**
5. The app icon will appear on your home screen!

### On iPhone (Safari):

1. Open the app in Safari (must use Safari, not Chrome)
2. Tap the **Share button** (square with arrow pointing up) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if you want (default: "Gain Tracker")
5. Tap **"Add"** in the top right
6. The app icon will appear on your home screen!

## Step 4: Use Your App!

- Tap the app icon on your home screen
- It will open fullscreen like a native app
- No browser bars - just your app!
- Works offline (basic functionality)

## Troubleshooting

### "Install" option not showing?

**Android:**
- Make sure you're using Chrome browser
- The site must be served over HTTPS (or localhost/network IP)
- Try refreshing the page
- Check that the manifest.json is loading: `http://YOUR_IP:3000/manifest.json`

**iPhone:**
- Must use Safari (Chrome won't work for installation)
- Make sure you're not in private browsing mode
- Try refreshing the page

### Can't connect to the server?

- Make sure both devices are on the same WiFi
- Check Windows Firewall isn't blocking port 3000
- Try using your phone's hotspot instead

### App icon looks wrong?

- Make sure `/public/apple-icon.png` exists (180x180px recommended)
- Check `/public/manifest.json` has correct icon paths

## For Production Deployment

When you're ready to deploy:

1. Deploy to a hosting service (Vercel, Netlify, etc.)
2. The app will automatically be installable via HTTPS
3. Users can install directly from the browser

---

**Enjoy your app! 🎉**

