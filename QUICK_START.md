# 🚀 Quick Start Guide

## ✅ Dependencies Installed!
The server is starting up...

## 📱 How to Access on Your Phone

### Step 1: Find Your Computer's IP Address

**Windows PowerShell Method:**
```powershell
ipconfig | findstr IPv4
```

Look for an address like: `192.168.1.100` or `10.0.0.50`

### Step 2: Make Sure Phone and Computer Are on Same WiFi

- Both devices must be on the **same WiFi network**

### Step 3: Open on Your Phone

1. Open your phone's browser (Chrome, Safari, etc.)
2. Type in the address bar: `http://YOUR_IP:3000`
   - Replace `YOUR_IP` with the IP from Step 1
   - Example: `http://192.168.1.100:3000`

### Step 4: If It Doesn't Work

**Check Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find "Node.js" and check both Private and Public
4. If Node.js isn't listed, click "Allow another app" and add it

**Alternative - Use Network URL:**
- When the server starts, Next.js shows a "Network" URL
- Use that exact URL on your phone
- It looks like: `http://192.168.x.x:3000`

## 🎯 Demo Flow

1. **Onboarding**: Create your account at `/onboarding`
   - Set your current weight, goal weight, etc.

2. **Dashboard**: See your stats and progress

3. **Weight Tracking**: Log weight entries
   - Watch achievements unlock!

4. **Calories**: Log meals and track daily calories

5. **Achievements**: See your unlocked achievements

## 💡 Pro Tips

- The app saves everything in your browser (localStorage)
- Refresh the page to see updates
- All data persists between sessions
- Works offline once loaded!

## 🛠️ Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

**Server Status**: Check your terminal for the local and network URLs!


