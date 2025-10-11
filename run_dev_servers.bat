@echo off
title Document Solutions Development Servers

echo ========================================
echo Document Solutions - Development Environment
echo ========================================
echo.

:: Check if we're in the correct directory
if not exist "backend\manage.py" (
    echo ERROR: Cannot find backend directory. Please run this script from the project root directory.
    echo Current directory: %CD%
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're in the project root directory (D:\PYTHON\Projects\Django\DSS)
    echo 2. Check that the backend directory exists with manage.py file
    echo.
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ERROR: Cannot find frontend directory. Please run this script from the project root directory.
    echo Current directory: %CD%
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're in the project root directory (D:\PYTHON\Projects\Django\DSS)
    echo 2. Check that the frontend directory exists with package.json file
    echo.
    pause
    exit /b 1
)

echo Starting Document Solutions Development Servers...
echo.

:: Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo.
    echo Troubleshooting:
    echo 1. Install Python from https://www.python.org/downloads/
    echo 2. Make sure Python is added to your system PATH
    echo 3. Restart your command prompt after installing Python
    echo.
    pause
    exit /b 1
)

:: Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo.
    echo Troubleshooting:
    echo 1. Install Node.js from https://nodejs.org/
    echo 2. Make sure Node.js is added to your system PATH
    echo 3. Restart your command prompt after installing Node.js
    echo.
    pause
    exit /b 1
)

:: Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo WARNING: Virtual environment not found. Creating one...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment.
        echo.
        echo Troubleshooting:
        echo 1. Make sure you have permission to create directories in this location
        echo 2. Check if Python venv module is available
        echo.
        pause
        exit /b 1
    )
    echo Virtual environment created successfully.
    echo.
)

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment.
    echo.
    echo Troubleshooting:
    echo 1. Check if venv\Scripts\activate.bat exists
    echo 2. Make sure you have permission to run batch files
    echo.
    pause
    exit /b 1
)

:: Check if Django is installed
python -c "import django; print('Django version:', django.get_version())" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Django and other Python dependencies...
    pip install -r backend\requirements.txt
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Python dependencies.
        echo.
        echo Troubleshooting:
        echo 1. Check your internet connection
        echo 2. Verify that requirements.txt exists and is valid
        echo 3. Make sure you have permission to install packages
        echo.
        pause
        exit /b 1
    )
    echo Python dependencies installed successfully.
    echo.
)

:: Check if Node modules are installed
if not exist "frontend\node_modules" (
    echo Installing Node.js dependencies...
    cd frontend
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Node.js dependencies.
        echo.
        echo Troubleshooting:
        echo 1. Check your internet connection
        echo 2. Verify that package.json exists and is valid
        echo 3. Make sure you have permission to install packages
        echo.
        pause
        exit /b 1
    )
    cd ..
    echo Node.js dependencies installed successfully.
    echo.
)

:: Start backend server
echo Starting Django backend server...
echo This may take a few seconds...
start "Django Backend Server" /D "backend" cmd /c "python manage.py runserver 8000 ^& pause"

:: Wait a few seconds for backend to start
timeout /t 5 /nobreak >nul

:: Check if backend server started successfully
netstat -an | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo Backend server started successfully on http://127.0.0.1:8000
) else (
    echo WARNING: Backend server may not have started correctly.
    echo Troubleshooting:
    echo 1. Check if port 8000 is already in use
    echo 2. Verify that Django is properly installed
    echo 3. Check the backend server console for error messages
    echo.
)

:: Start frontend server
echo Starting React frontend server...
echo This may take a few seconds...
start "React Frontend Server" /D "frontend" cmd /c "npm start ^& pause"

echo.
echo ========================================
echo Servers are starting up...
echo ========================================
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Notes:
echo - Backend server console will show Django startup messages
echo - Frontend server console will show React compilation status
echo - Close the individual server console windows to stop each server
echo - Press any key to close this window (servers will continue running)
echo.
pause