# PowerShell script to push app to GitHub

Write-Host "🚀 Setting up Git repository..." -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Set branch to main
git branch -M main

# Add remote (will fail if already exists, that's okay)
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/blackMaax/Weight-Gain-App.git

# Add all files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Initial commit: Weight Gain Tracker App with PWA support"
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🌐 Repository: https://github.com/blackMaax/Weight-Gain-App" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to https://vercel.com" -ForegroundColor White
    Write-Host "2. Import your GitHub repository" -ForegroundColor White
    Write-Host "3. Vercel will automatically deploy your app!" -ForegroundColor White
} else {
    Write-Host "No changes to commit. Everything is up to date!" -ForegroundColor Green
}

