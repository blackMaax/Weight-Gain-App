Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing and Pushing to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if git is initialized
Write-Host "[1] Checking Git initialization..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    Write-Host "  Initializing Git..." -ForegroundColor Yellow
    git init
    Write-Host "  ✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "  ✓ Git already initialized" -ForegroundColor Green
}

# Step 2: Set up remote
Write-Host ""
Write-Host "[2] Setting up remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/blackMaax/Weight-Gain-App.git
Write-Host "  Remote URL:" -ForegroundColor Gray
git remote -v

# Step 3: Set branch to main
Write-Host ""
Write-Host "[3] Setting branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "  Current branch:" -ForegroundColor Gray
git branch

# Step 4: Add all files
Write-Host ""
Write-Host "[4] Adding all files..." -ForegroundColor Yellow
git add .
$staged = git diff --cached --name-only
if ($staged) {
    Write-Host "  ✓ Files staged:" -ForegroundColor Green
    $staged | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
} else {
    Write-Host "  ⚠ No files to stage (may already be committed)" -ForegroundColor Yellow
}

# Step 5: Commit
Write-Host ""
Write-Host "[5] Creating commit..." -ForegroundColor Yellow
$lastCommit = git log -1 --oneline 2>$null
if (-not $lastCommit) {
    git commit -m "Initial commit: Weight Gain Tracker App with PWA support"
    Write-Host "  ✓ Commit created" -ForegroundColor Green
} else {
    Write-Host "  ✓ Commit already exists: $lastCommit" -ForegroundColor Green
}

# Step 6: Show current status
Write-Host ""
Write-Host "[6] Current status:" -ForegroundColor Yellow
git status --short

# Step 7: Push with token
Write-Host ""
Write-Host "[7] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "  Using token authentication..." -ForegroundColor Gray

$token = "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"
$remoteWithToken = "https://${token}@github.com/blackMaax/Weight-Gain-App.git"

# Temporarily set remote with token
git remote set-url origin $remoteWithToken

# Push
Write-Host "  Executing push..." -ForegroundColor Gray
$pushOutput = git push -u origin main 2>&1
Write-Host $pushOutput

# Remove token from remote URL for security
git remote set-url origin https://github.com/blackMaax/Weight-Gain-App.git

# Step 8: Verify
Write-Host ""
Write-Host "[8] Verifying push..." -ForegroundColor Yellow
$remoteCheck = git ls-remote origin main 2>&1
if ($LASTEXITCODE -eq 0 -and $remoteCheck) {
    Write-Host "  ✓ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "  Check: https://github.com/blackMaax/Weight-Gain-App" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ Push may have failed" -ForegroundColor Red
    Write-Host "  Error: $remoteCheck" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

