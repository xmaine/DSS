@echo off
title Backend Server - Document Solutions

:: Navigate to project root
cd /d "%~dp0.."

echo ========================================
echo Backend Server - Document Solutions
echo ========================================
echo.

:: ========================================
:: STEP 1: CLOSE EXISTING BACKEND SERVERS
:: ========================================
echo [1/3] Closing existing backend servers...

:: Kill processes on port 8000 (backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING 2^>nul') do (
    echo Closing backend process on port 8000 (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill any Python processes that might be running Django
for /f "tokens=2" %%a in ('tasklist ^| findstr python.exe 2^>nul') do (
    echo Closing Python process (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Wait for processes to close
ping -n 3 127.0.0.1 >nul

:: Verify port 8000 is free
netstat -an | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8000 still in use
) else (
    echo Port 8000 is now free
)

echo [1/3] Backend cleanup completed.
echo.

:: ========================================
:: STEP 2: CHECK REQUIREMENTS
:: ========================================
echo [2/3] Checking backend requirements...

:: Check if we're in the right directory
if not exist "backend\manage.py" (
    echo ERROR: Cannot find backend\manage.py
    echo Current directory: %CD%
    echo Please run this script from the .bat directory.
    pause
    exit /b 1
)

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python.
    pause
    exit /b 1
) else (
    echo Python found: 
    python --version
)

:: Check if virtual environment exists
if exist "venv\Scripts\activate.bat" (
    echo Virtual environment found
) else (
    echo WARNING: Virtual environment not found
    echo Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
)

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
) else (
    echo Virtual environment activated
)

:: Check if Django is installed
python -c "import django; print('Django version:', django.get_version())" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Python dependencies...
    pip install -r backend\requirements.txt
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Python dependencies
        pause
        exit /b 1
    )
    echo Python dependencies installed successfully
) else (
    echo Django is already installed
    python -c "import django; print('Django version:', django.get_version())"
)

echo [2/3] Backend requirements check completed.
echo.

:: ========================================
:: STEP 3: START BACKEND SERVER
:: ========================================
echo [3/3] Starting backend server...

:: Start Django backend server
echo Starting Django backend server on port 8000...
start "Django Backend Server" /D "backend" cmd /k "title Django Backend Server & python manage.py runserver 8000"

:: Wait for backend to start
echo Waiting for backend server to initialize...
ping -n 8 127.0.0.1 >nul

:: Check if backend server started successfully
netstat -an | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Backend Server Started Successfully!
    echo ========================================
    echo.
    echo Backend Server: http://127.0.0.1:8000
    echo.
    echo A new window opened with the Django server.
    echo Keep that window open for the server to run.
    echo.
    echo This window can be closed.
    echo.
) else (
    echo.
    echo ========================================
    echo Backend Server Warning
    echo ========================================
    echo.
    echo Backend server may not have started correctly.
    echo Check the Django Backend Server window for error messages.
    echo.
    echo Common issues:
    echo - Database migration needed
    echo - Port 8000 still in use
    echo - Django configuration error
    echo.
)

echo Press any key to close this window...
pause >nul
