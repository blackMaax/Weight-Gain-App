Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verifying Git Push Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1] Checking Git repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✗ Git not initialized" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2] Remote repository:" -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "[3] Current branch:" -ForegroundColor Yellow
git branch --show-current

Write-Host ""
Write-Host "[4] Last commit:" -ForegroundColor Yellow
git log -1 --oneline

Write-Host ""
Write-Host "[5] Checking if pushed to GitHub..." -ForegroundColor Yellow
$remoteStatus = git ls-remote --heads origin main 2>&1
if ($LASTEXITCODE -eq 0 -and $remoteStatus) {
    Write-Host "✓ Repository exists on GitHub" -ForegroundColor Green
    Write-Host "  $remoteStatus" -ForegroundColor Gray
} else {
    Write-Host "⚠ Push may need authentication" -ForegroundColor Yellow
    Write-Host "  Run: git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "[6] Unpushed commits:" -ForegroundColor Yellow
$unpushed = git log origin/main..HEAD --oneline 2>&1
if ($unpushed -and $LASTEXITCODE -eq 0) {
    Write-Host "  $unpushed" -ForegroundColor Yellow
} else {
    Write-Host "  (No unpushed commits or remote not connected)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Check your repo: https://github.com/blackMaax/Weight-Gain-App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

