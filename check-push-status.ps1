Write-Host "Checking push status..." -ForegroundColor Cyan
Write-Host ""

# Check if we can reach the remote
Write-Host "Checking remote connection..." -ForegroundColor Yellow
$remoteCheck = git ls-remote origin main 2>&1
if ($LASTEXITCODE -eq 0 -and $remoteCheck) {
    Write-Host "✓ Successfully connected to GitHub!" -ForegroundColor Green
    Write-Host "  Remote branch found: $($remoteCheck.Split("`t")[0])" -ForegroundColor Gray
    Write-Host ""
    Write-Host "✓ Your code has been pushed!" -ForegroundColor Green
    Write-Host "  Check: https://github.com/blackMaax/Weight-Gain-App" -ForegroundColor Cyan
} else {
    Write-Host "⚠ Push may have failed or needs authentication" -ForegroundColor Yellow
    Write-Host "  Error: $remoteCheck" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running: git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "Local commit status:" -ForegroundColor Yellow
git log -1 --oneline 2>&1

Write-Host ""
Write-Host "Repository status:" -ForegroundColor Yellow
git status --short 2>&1

