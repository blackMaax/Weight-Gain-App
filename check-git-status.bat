@echo off
echo ========================================
echo Git Repository Status Check
echo ========================================
echo.

echo [1] Checking if Git is initialized...
if exist .git (
    echo ✓ Git repository exists
) else (
    echo ✗ Git not initialized
    exit /b 1
)

echo.
echo [2] Current branch:
git branch --show-current

echo.
echo [3] Remote repository:
git remote -v

echo.
echo [4] Last commit:
git log -1 --oneline

echo.
echo [5] Files status:
git status --short

echo.
echo [6] Unpushed commits:
git log origin/main..HEAD --oneline 2>nul || echo (Checking push status...)

echo.
echo ========================================
echo Done!
echo ========================================
pause

