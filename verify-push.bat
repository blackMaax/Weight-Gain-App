@echo off
echo ========================================
echo Verifying Git Push
echo ========================================
echo.

echo [1] Checking Git status...
git status
echo.

echo [2] Last commit:
git log -1 --oneline
echo.

echo [3] Remote repository:
git remote -v
echo.

echo [4] Checking if code is on GitHub...
git ls-remote origin main
echo.

echo ========================================
echo Check your repo: https://github.com/blackMaax/Weight-Gain-App
echo ========================================
pause

