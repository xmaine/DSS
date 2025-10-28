@echo off
setlocal enabledelayedexpansion

echo ====================================================
echo    DOCUMENT SOLUTIONS - Git Update and Backup Script
echo ====================================================
echo.

echo Current time: %date% %time%
echo.

REM Navigate to the project directory
cd /d D:\PYTHON\Projects\Django\DSS

echo Pulling latest changes from remote repository...
git pull origin Qoder
echo.

echo Checking current git status...
git status
echo.

REM Git-only backup approach - Add and commit all changes
echo Adding all changes to git...
git add .
echo.

REM Check if there are changes to commit
git diff-index --quiet HEAD || (
    echo Committing changes...
    
    REM Commit changes with a timestamp
    for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
    set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
    set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
    set "datestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"
    
    git commit -m "Update: Changes committed on %datestamp%"
    
    echo Pushing changes to main remote repository...
    git push origin Qoder
    
    if !errorlevel! equ 0 (
        echo.
        echo ====================================================
        echo    SUCCESS: Repository updated and pushed to main remote!
        echo ====================================================
        
        REM Also push to backup repository if it exists
        echo.
        echo Checking for backup repository...
        git remote get-url DSS_Backup >nul 2>&1
        if !errorlevel! equ 0 (
            echo Pushing changes to backup repository...
            git push DSS_Backup Qoder
            if !errorlevel! equ 0 (
                echo.
                echo ====================================================
                echo    SUCCESS: Repository also pushed to backup!
                echo ====================================================
            ) else (
                echo.
                echo ====================================================
                echo    WARNING: Failed to push to backup repository.
                echo ====================================================
            )
        ) else (
            echo.
            echo ====================================================
            echo    INFO: No backup repository configured.
            echo ====================================================
        )
    ) else (
        echo.
        echo ====================================================
        echo    ERROR: Failed to push to main remote repository.
        echo ====================================================
    )
) || (
    echo No changes to commit.
)

echo.
echo Script execution completed.
pause