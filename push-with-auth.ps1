Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is available
$ghAvailable = Get-Command gh -ErrorAction SilentlyContinue

if ($ghAvailable) {
    Write-Host "GitHub CLI detected!" -ForegroundColor Green
    Write-Host "Checking authentication..." -ForegroundColor Yellow
    
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Already authenticated with GitHub CLI" -ForegroundColor Green
        Write-Host ""
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git push -u origin main
    } else {
        Write-Host "⚠ Not authenticated. Running gh auth login..." -ForegroundColor Yellow
        gh auth login
        Write-Host ""
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git push -u origin main
    }
} else {
    Write-Host "GitHub CLI not found. Using manual authentication." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You'll need to authenticate when prompted:" -ForegroundColor Yellow
    Write-Host "1. Username: Your GitHub username" -ForegroundColor White
    Write-Host "2. Password: Use a Personal Access Token (NOT your password)" -ForegroundColor White
    Write-Host ""
    Write-Host "Get a token at: https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "Create token with 'repo' scope" -ForegroundColor Cyan
    Write-Host ""
    
    $continue = Read-Host "Press Enter to continue with push (or Ctrl+C to cancel)"
    
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Check your repo: https://github.com/blackMaax/Weight-Gain-App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

