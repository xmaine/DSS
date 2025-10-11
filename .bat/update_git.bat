@echo off
echo ==========================================
echo Git Update Script
echo ==========================================
echo.

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH
    echo Please install Git and make sure it's available in your PATH
    pause
    exit /b 1
)

echo Current branch:
git branch --show-current
echo.

echo ==========================================
echo Step 1: Committing local changes to Git
echo ==========================================
echo.

REM Add all files to git
git add .

REM Check if there are changes to commit
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    REM Commit changes with timestamp
    for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
    set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
    set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
    set "datestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"
    
    git commit -m "Local backup - %datestamp%"
    if %errorlevel% neq 0 (
        echo Error: Failed to commit changes
        pause
        exit /b 1
    )
    echo Local changes committed successfully.
) else (
    echo No local changes to commit.
)
echo.

echo ==========================================
echo Step 2: Pushing to remote repository
echo ==========================================
echo.

echo Pushing changes to remote repository...
git push
if %errorlevel% neq 0 (
    echo Error: Failed to push to remote repository
    echo You may need to set up your Git credentials or check your network connection
    pause
    exit /b 1
)
echo.

echo ==========================================
echo Step 3: Updating from remote repository
echo ==========================================
echo.

echo Fetching latest changes from remote repository...
git fetch
if %errorlevel% neq 0 (
    echo Error: Failed to fetch from remote repository
    pause
    exit /b 1
)
echo.

echo Checking for local changes...
git status --porcelain >nul
if %errorlevel% neq 0 (
    echo Error: Failed to check repository status
    pause
    exit /b 1
)

REM Check if there are any local changes
git diff-index --quiet HEAD --
if %errorlevel% equ 0 (
    echo No local changes detected.
) else (
    echo Local changes detected:
    git status --porcelain
    echo.
    echo WARNING: You have local changes that might be overwritten!
    echo.
    set /p choice=Do you want to continue with git pull? (y/N): 
    if /i not "%choice%"=="y" (
        echo Operation cancelled by user.
        pause
        exit /b 0
    )
)
echo.

echo Pulling latest changes...
git pull
if %errorlevel% neq 0 (
    echo Error: Failed to pull changes
    pause
    exit /b 1
)
echo.

echo Git update completed successfully!
echo.
echo Current commit:
git log --oneline -1
echo.

pause