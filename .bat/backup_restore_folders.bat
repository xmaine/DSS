@echo off
:: DSS Folder Backup and Restore Script
:: Automates backup and restoration of folder structure

echo ==================================================
echo        DSS FOLDER BACKUP AND RESTORE
echo ==================================================
echo.

:: Navigate to the backend directory
cd /d "%~dp0..\backend"

echo Current directory: %CD%
echo.

:: Check if manage.py exists
if not exist "manage.py" (
    echo ERROR: manage.py not found!
    echo Please run this script from the correct directory.
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

:: Display menu
echo Select an option:
echo 1. Backup folder structure
echo 2. Restore folder structure
echo 3. Exit
echo.
choice /c 123 /m "Select an option"
if errorlevel 3 goto EXIT
if errorlevel 2 goto RESTORE
if errorlevel 1 goto BACKUP

:BACKUP
echo.
echo === BACKUP FOLDER STRUCTURE ===
echo.

:: Get backup filename
set /p "backup_name=Enter backup filename (without extension, default: folder_backup): " || set "backup_name=folder_backup"
if "%backup_name%"=="" set "backup_name=folder_backup"

:: Add timestamp to filename
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"

set "full_backup_name=%backup_name%_%timestamp%.json"

echo.
echo Creating backup: %full_backup_name%
echo.

python manage.py backup_folders --output "%full_backup_name%"

if %errorlevel% equ 0 (
    echo.
    echo ==================================================
    echo Backup completed successfully!
    echo Backup file: %full_backup_name%
    echo ==================================================
) else (
    echo.
    echo ==================================================
    echo Backup failed!
    echo ==================================================
)

echo.
echo Press any key to continue...
pause >nul
goto MENU

:RESTORE
echo.
echo === RESTORE FOLDER STRUCTURE ===
echo.

:: List available backup files
echo Available backup files:
dir /b *.json 2>nul | findstr /i "backup" >nul
if %errorlevel% equ 0 (
    dir /b *.json | findstr /i "backup"
) else (
    echo No backup files found in current directory.
)

echo.
set /p "restore_file=Enter backup filename to restore: "
if "%restore_file%"=="" (
    echo No filename entered.
    echo.
    echo Press any key to continue...
    pause >nul
    goto MENU
)

:: Check if file exists
if not exist "%restore_file%" (
    echo ERROR: File %restore_file% not found!
    echo.
    echo Press any key to continue...
    pause >nul
    goto MENU
)

echo.
echo Restoring from: %restore_file%
echo.

:: Ask for force option
echo Force restoration? This will overwrite existing folders.
choice /m "Continue with force restoration"
if errorlevel 2 (
    echo Performing force restoration...
    python manage.py restore_folders "%restore_file%" --force
) else (
    echo Performing normal restoration...
    python manage.py restore_folders "%restore_file%"
)

if %errorlevel% equ 0 (
    echo.
    echo ==================================================
    echo Restoration completed successfully!
    echo ==================================================
) else (
    echo.
    echo ==================================================
    echo Restoration failed!
    echo ==================================================
)

echo.
echo Press any key to continue...
pause >nul
goto MENU

:MENU
echo.
echo ==================================================
echo        DSS FOLDER BACKUP AND RESTORE
echo ==================================================
echo.
echo Select an option:
echo 1. Backup folder structure
echo 2. Restore folder structure
echo 3. Exit
echo.
choice /c 123 /m "Select an option"
if errorlevel 3 goto EXIT
if errorlevel 2 goto RESTORE
if errorlevel 1 goto BACKUP

:EXIT
echo.
echo Thank you for using DSS Folder Backup and Restore!
echo.
echo Press any key to exit...
pause >nul
exit /b 0