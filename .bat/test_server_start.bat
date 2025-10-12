@echo off
title Document Solutions - Test Server Start

:: Navigate to the project root directory (parent of .bat directory)
cd /d "%~dp0.."

echo ========================================
echo Document Solutions - Test Server Start
echo ========================================
echo.

echo Testing server startup without user interaction...
echo.

:: Start backend server
echo Starting Django backend server...
start "Django Backend Server" /D "backend" cmd /k "title Django Backend Server & python manage.py runserver 8000"

:: Wait a few seconds for backend to start
timeout /t 5 /nobreak >nul

:: Check if backend server started successfully
netstat -an | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo [BACKEND SERVER SUCCESS] Backend server started successfully on http://127.0.0.1:8000
) else (
    echo [BACKEND SERVER WARNING] Backend server may not have started correctly.
)

:: Start frontend server
echo Starting React frontend server...
start "React Frontend Server" /D "frontend" cmd /k "title React Frontend Server & npm start"

:: Wait for frontend server to start
echo [FRONTEND SERVER] Waiting for frontend server to initialize...
timeout /t 15 /nobreak >nul

:: Check if frontend server started successfully
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [FRONTEND SERVER SUCCESS] Frontend server started successfully on http://127.0.0.1:3000/
) else (
    echo [FRONTEND SERVER WARNING] Frontend server may not have started correctly.
)

:: Open Chrome browser to the frontend URL
echo [BROWSER] Opening Chrome browser to http://127.0.0.1:3000/
timeout /t 3 /nobreak >nul

:: Try multiple methods to open Chrome
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://127.0.0.1:3000/"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://127.0.0.1:3000/"
) else (
    :: Fallback to just chrome.exe if in PATH
    start chrome.exe "http://127.0.0.1:3000/"
)

echo.
echo ========================================
echo Test Complete
echo ========================================
echo Servers should be running and Chrome should have opened
echo.
echo Press any key to close this window...
pause >nul