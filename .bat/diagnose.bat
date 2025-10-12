@echo off
title System Diagnosis

echo ========================================
echo System Diagnosis for DSS Project
echo ========================================
echo.

echo [1] Current working directory:
echo %CD%
echo.

echo [2] Script location:
echo %~dp0
echo.

echo [3] Project root check:
cd /d "%~dp0.."
echo Project root: %CD%
echo.

echo [4] Backend directory check:
if exist "backend\manage.py" (
    echo ✓ Backend directory found
    echo Backend contents:
    dir backend /b
) else (
    echo ✗ Backend directory NOT found
    echo Current directory contents:
    dir /b
)
echo.

echo [5] Frontend directory check:
if exist "frontend\package.json" (
    echo ✓ Frontend directory found
    echo Frontend contents:
    dir frontend /b
) else (
    echo ✗ Frontend directory NOT found
)
echo.

echo [6] Python check:
python --version 2>nul
if %errorlevel% equ 0 (
    echo ✓ Python found
) else (
    echo ✗ Python NOT found
)
echo.

echo [7] Node.js check:
node --version 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node.js found
) else (
    echo ✗ Node.js NOT found
)
echo.

echo [8] Virtual environment check:
if exist "venv\Scripts\activate.bat" (
    echo ✓ Virtual environment found
) else (
    echo ✗ Virtual environment NOT found
)
echo.

echo [9] Port status:
echo Port 8000:
netstat -an | findstr :8000
echo Port 3000:
netstat -an | findstr :3000
echo.

echo [10] Chrome check:
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo ✓ Chrome found in Program Files
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo ✓ Chrome found in Program Files (x86)
) else (
    echo ✗ Chrome NOT found in standard locations
)
echo.

echo ========================================
echo Diagnosis Complete
echo ========================================
echo.
echo If you see any ✗ marks above, those are the issues to fix.
echo.
pause
