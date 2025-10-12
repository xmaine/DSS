@echo off
title Document Solutions - Server Verification

:: Navigate to the project root directory (parent of .bat directory)
cd /d "%~dp0.."

echo ========================================
echo Document Solutions - Server Verification
echo ========================================
echo.

echo Checking if server processes are running...
echo.

echo Checking for Django backend server (port 8000)...
netstat -an | findstr :8000
if %errorlevel% equ 0 (
    echo [BACKEND DETECTED] Django backend server appears to be running on port 8000
) else (
    echo [BACKEND NOT DETECTED] Django backend server does not appear to be running
)

echo.
echo Checking for React frontend server (port 3000)...
netstat -an | findstr :3000
if %errorlevel% equ 0 (
    echo [FRONTEND DETECTED] React frontend server appears to be running on port 3000
) else (
    echo [FRONTEND NOT DETECTED] React frontend server does not appear to be running
)

echo.
echo Checking for command windows...
tasklist /v /fo csv | findstr /i "cmd.exe" | findstr /i "Django\|React"
if %errorlevel% equ 0 (
    echo [WINDOWS DETECTED] Server command windows appear to be running
) else (
    echo [WINDOWS NOT DETECTED] No server command windows detected
)

echo.
echo ========================================
echo Verification Complete
echo ========================================
echo.
echo If servers are not running, try:
echo 1. Running the script from Command Prompt instead of PowerShell
echo 2. Checking Windows Firewall settings
echo 3. Ensuring no other processes are using ports 8000 or 3000
echo.
pause