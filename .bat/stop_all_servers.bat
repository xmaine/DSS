@echo off
title Document Solutions - Stop All Servers

echo ========================================
echo Document Solutions - Stop All Servers
echo ========================================
echo.

echo [STOPPING] Stopping all Document Solutions servers...
echo.

:: Kill processes on port 8000 (backend)
echo [PORT 8000] Checking for processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING 2^>nul') do (
    echo [PORT 8000] Killing process (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill processes on port 3000 (frontend)
echo [PORT 3000] Checking for processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo [PORT 3000] Killing process (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill any python processes that might be running Django
echo [PYTHON] Checking for Python processes...
for /f "tokens=2" %%a in ('tasklist ^| findstr python.exe 2^>nul') do (
    echo [PYTHON] Killing Python process (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill any node processes that might be running React
echo [NODE] Checking for Node.js processes...
for /f "tokens=2" %%a in ('tasklist ^| findstr node.exe 2^>nul') do (
    echo [NODE] Killing Node.js process (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Wait a moment for processes to terminate
timeout /t 3 /nobreak >nul

echo.
echo [VERIFICATION] Checking if ports are free...
echo.

:: Verify port 8000 is free
netstat -an | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo [PORT 8000] Still in use - please check manually
) else (
    echo [PORT 8000] Free
)

:: Verify port 3000 is free
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [PORT 3000] Still in use - please check manually
) else (
    echo [PORT 3000] Free
)

echo.
echo ========================================
echo All servers stopped
echo ========================================
echo.
echo You can now safely run the development servers
echo.
pause