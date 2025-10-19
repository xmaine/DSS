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

echo Checking current git status...
git status
echo.

REM Backup DSS directory before committing changes
echo Backing up DSS directory...
if exist "C:\Users\Default\AppData\Local\DSS" (
    echo DSS directory found. Creating backup...
    REM Create backup directory if it doesn't exist
    if not exist "D:\DSS_Backup" (
        mkdir "D:\DSS_Backup"
    )
    
    REM Copy DSS directory to backup location
    xcopy "C:\Users\Default\AppData\Local\DSS" "D:\DSS_Backup\DSS_Backup_%date:~-4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%" /E /I /H /Y >nul
    
    if !errorlevel! equ 0 (
        echo DSS directory backed up successfully.
    ) else (
        echo WARNING: Failed to backup DSS directory.
    )
) else (
    echo DSS directory not found. Skipping backup.
)
echo.

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
    
    echo Pushing changes to remote repository...
    git push origin Qoder
    
    if !errorlevel! equ 0 (
        echo.
        echo ====================================================
        echo    SUCCESS: Repository updated and pushed to remote!
        echo ====================================================
    ) else (
        echo.
        echo ====================================================
        echo    ERROR: Failed to push to remote repository.
        echo ====================================================
    )
) || (
    echo No changes to commit.
)

echo.
echo Script execution completed.
pause