# How to Run on Your Phone - Quick Guide

## Step 1: Install Dependencies (First Time Only)

Open PowerShell or Terminal in the project folder and run:
```bash
npm install
```
or if you're using pnpm:
```bash
pnpm install
```

## Step 2: Start the Development Server

Run this command:
```bash
npm run dev
```

You should see output like:
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000
```

## Step 3: Find Your Computer's IP Address

### On Windows:
1. Open Command Prompt or PowerShell
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter (usually WiFi or Ethernet)
4. It will look like: `192.168.1.xxx` or `10.0.0.xxx`

### Quick Method:
- Open PowerShell
- Run: `ipconfig | findstr IPv4`
- Copy the IP address shown

## Step 4: Connect Your Phone

### Option A: Same WiFi Network (Easiest)
1. Make sure your phone and computer are on the **same WiFi network**
2. On your phone, open a web browser (Chrome, Safari, etc.)
3. Type in the address bar: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`
4. The app should load!

### Option B: Using Network URL from Next.js
- When you run `npm run dev`, Next.js shows a "Network" URL
- Use that exact URL on your phone
- Example: `http://192.168.1.100:3000`

## Troubleshooting

### Can't Connect?
1. **Check Firewall**: Windows Firewall might be blocking port 3000
   - Go to Windows Defender Firewall → Allow an app
   - Allow Node.js through firewall
   - Or temporarily disable firewall for testing

2. **Check Network**: Make sure phone and computer are on same WiFi

3. **Try Localhost Tunnel** (Alternative):
   - Use a service like `ngrok` or `localtunnel`
   - Install: `npm install -g localtunnel`
   - Run: `lt --port 3000`
   - Use the provided URL on your phone

### Port Already in Use?
- Kill the process using port 3000
- Or change the port: `npm run dev -- -p 3001`

## Quick Start Commands

```bash
# Install dependencies (first time)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## For Demo on Phone

1. Start the server: `npm run dev`
2. Note the Network URL (e.g., `http://192.168.1.100:3000`)
3. Open that URL on your phone's browser
4. Complete onboarding to create an account
5. Start logging weight and calories!
6. Watch achievements unlock as you use the app

---

**Tip**: For a smoother demo, you can also use your phone's hotspot and connect your computer to it, then use the hotspot's network IP.


