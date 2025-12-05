Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing ALL App Files to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1] Adding ALL files..." -ForegroundColor Yellow
git add .
Write-Host "  ✓ Files added" -ForegroundColor Green

Write-Host ""
Write-Host "[2] Files to be committed:" -ForegroundColor Yellow
git status --short | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

Write-Host ""
Write-Host "[3] Creating commit..." -ForegroundColor Yellow
git commit -m "Add complete Weight Gain Tracker App with PWA support"
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Commit created" -ForegroundColor Green
} else {
    Write-Host "  ⚠ No changes to commit (may already be committed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4] Pushing to GitHub..." -ForegroundColor Yellow
$pushOutput = git push origin main 2>&1
Write-Host $pushOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "  ✓ SUCCESS! All files pushed!" -ForegroundColor Green
    Write-Host "  Check: https://github.com/blackMaax/Weight-Gain-App" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "  ✗ Push failed. Error:" -ForegroundColor Red
    Write-Host $pushOutput -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

