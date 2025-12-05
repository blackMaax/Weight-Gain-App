Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "`nFiles to commit:" -ForegroundColor Yellow
git status --short

Write-Host "`nCommitting..." -ForegroundColor Yellow
git commit -m "Add complete Weight Gain Tracker App"

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`nDone! Check: https://github.com/blackMaax/Weight-Gain-App" -ForegroundColor Green

