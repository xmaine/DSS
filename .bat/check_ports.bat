@echo off
title Document Solutions - Port Check

echo ========================================
echo Document Solutions - Port Check
echo ========================================
echo.

echo Checking for processes on ports 8000 and 3000...
echo.

echo Port 8000 (Django Backend):
netstat -aon | findstr :8000
if %errorlevel% equ 0 (
    echo [PORT 8000] Processes found
) else (
    echo [PORT 8000] No processes found
)

echo.
echo Port 3000 (React Frontend):
netstat -aon | findstr :3000
if %errorlevel% equ 0 (
    echo [PORT 3000] Processes found
) else (
    echo [PORT 3000] No processes found
)

echo.
echo All active network connections:
netstat -an | findstr LISTENING
echo.
pause