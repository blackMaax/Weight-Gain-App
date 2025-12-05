@echo off
echo ========================================
echo Pushing Weight Gain App to GitHub
echo ========================================
echo.

echo Checking Git status...
git status

echo.
echo Checking remote connection...
git remote -v

echo.
echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Update: Weight Gain Tracker App with PWA support"

echo.
echo Pushing to GitHub...
echo (You may need to authenticate)
git push -u origin main

echo.
echo ========================================
echo Done! Check https://github.com/blackMaax/Weight-Gain-App
echo ========================================
pause

