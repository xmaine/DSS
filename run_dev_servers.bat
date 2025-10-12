@echo off
title Document Solutions Development Servers

echo ========================================
echo Document Solutions - Development Environment
echo ========================================
echo.

:: Enhanced debugging information
echo [DEBUG] Script started at: %date% %time%
echo [DEBUG] Current working directory: %CD%
echo [DEBUG] Script location: %~dp0
echo [DEBUG] Full script path: %~f0
echo.

:: Check if we're in the correct directory with more detailed output
echo [BACKEND CHECK] Checking for backend files...
echo [DEBUG] Checking if backend directory exists...
if exist "backend" (
    echo [DEBUG] Backend directory exists
    echo [DEBUG] Backend directory contents:
    dir backend /b
    echo [DEBUG] Checking for backend\manage.py...
    if exist "backend\manage.py" (
        echo [BACKEND SUCCESS] Found backend\manage.py
    ) else (
        echo [BACKEND ERROR] Cannot find backend\manage.py
        echo [BACKEND ERROR DETAILS] Backend directory exists but manage.py is missing
        echo [BACKEND ERROR DETAILS] Current directory: %CD%
        echo [BACKEND ERROR DETAILS] Backend directory contents:
        dir backend /b
        echo.
        echo Troubleshooting:
        echo 1. Make sure you're in the project root directory (D:\PYTHON\Projects\Django\DSS)
        echo 2. Check that the backend directory exists with manage.py file
        echo 3. Verify file permissions on the backend directory
        echo.
        pause
        exit /b 1
    )
) else (
    echo [BACKEND ERROR] Cannot find backend directory
    echo [BACKEND ERROR DETAILS] Current directory: %CD%
    echo [BACKEND ERROR DETAILS] Directory contents:
    dir /b
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're in the project root directory (D:\PYTHON\Projects\Django\DSS)
    echo 2. Check that the backend directory exists with manage.py file
    echo.
    pause
    exit /b 1
)

echo [FRONTEND CHECK] Checking for frontend files...
echo [DEBUG] Checking if frontend directory exists...
if exist "frontend" (
    echo [DEBUG] Frontend directory exists
    echo [DEBUG] Frontend directory contents:
    dir frontend /b
    echo [DEBUG] Checking for frontend\package.json...
    if exist "frontend\package.json" (
        echo [FRONTEND SUCCESS] Found frontend\package.json
    ) else (
        echo [FRONTEND ERROR] Cannot find frontend\package.json
        echo [FRONTEND ERROR DETAILS] Frontend directory exists but package.json is missing
        echo [FRONTEND ERROR DETAILS] Current directory: %CD%
        echo [FRONTEND ERROR DETAILS] Frontend directory contents:
        dir frontend /b
        echo.
        echo Troubleshooting:
        echo 1. Make sure you're in the project root directory (D:\PYTHON\Projects\Django\DSS)
        echo 2. Check that the frontend directory exists with package.json file
        echo 3. Verify file permissions on the frontend directory
        echo.
        pause
        exit /b 1
    )
) else (
    echo [FRONTEND ERROR] Cannot find frontend directory
    echo [FRONTEND ERROR DETAILS] Current directory: %CD%
    echo [FRONTEND ERROR DETAILS] Directory contents:
    dir /b
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're in the project root directory (D:\PYTHON\Projects\Django\DSS)
    echo 2. Check that the frontend directory exists with package.json file
    echo.
    pause
    exit /b 1
)

echo [ALL CHECKS PASSED] Starting Document Solutions Development Servers...
echo.

:: Check if Python is available
echo [PYTHON CHECK] Checking if Python is available...
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
) else (
    echo [PYTHON SUCCESS] Python is available
    python --version
)

:: Check if Node.js is available
echo [NODE CHECK] Checking if Node.js is available...
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
) else (
    echo [NODE SUCCESS] Node.js is available
    node --version
)

:: Check if virtual environment exists
echo [VENV CHECK] Checking if virtual environment exists...
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
) else (
    echo [VENV SUCCESS] Virtual environment found
)

:: Activate virtual environment
echo [VENV ACTIVATE] Activating virtual environment...
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
) else (
    echo [VENV ACTIVATE SUCCESS] Virtual environment activated
    echo [VENV ACTIVATE DETAILS] Current Python path: %PYTHONPATH%
)

:: Check if Django is installed
echo [DJANGO CHECK] Checking if Django is installed...
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
) else (
    echo [DJANGO SUCCESS] Django is installed
    python -c "import django; print('Django version:', django.get_version())"
)

:: Check if Node modules are installed
echo [NPM CHECK] Checking if Node modules are installed...
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
) else (
    echo [NPM SUCCESS] Node modules found
)

:: Start backend server
echo Starting Django backend server...
echo This may take a few seconds...
start "Django Backend Server" /D "backend" cmd /k "python manage.py runserver 8000"

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
start "React Frontend Server" /D "frontend" cmd /k "npm start"

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