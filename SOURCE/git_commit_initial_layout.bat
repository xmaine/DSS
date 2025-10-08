@echo off
echo Initializing Git repository and committing initial layout...
echo.

REM Navigate to the project directory
cd /d D:\PYTHON\Projects\Django\DSS

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not available in PATH
    echo Please install Git and try again
    pause
    exit /b 1
)

REM Initialize git repository if it doesn't exist
if not exist .git (
    echo Initializing new Git repository...
    git init
    echo.
)

REM Add all files to staging
echo Adding all files to staging...
git add .
echo.

REM Check if there are any changes to commit
git diff --cached --quiet
if %errorlevel% equ 1 (
    echo Committing initial layout...
    git commit -m "initial layout"
    echo Initial layout committed successfully!
    echo.
) else (
    echo No changes to commit
    echo.
)

echo Setup complete!
pause