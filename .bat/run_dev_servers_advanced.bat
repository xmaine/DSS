@echo off
setlocal enabledelayedexpansion

title Document Solutions Development Servers

:: Navigate to the project root directory (parent of .bat directory)
cd /d "%~dp0.."

:: Configuration
set BACKEND_PORT=8000
set FRONTEND_PORT=3000
set BACKEND_DIR=backend
set FRONTEND_DIR=frontend
set VENV_DIR=venv

echo ========================================
echo Document Solutions - Development Environment
echo Advanced Server Startup Script
echo ========================================
echo.

:: Kill any existing processes on ports 8000 and 3000 to ensure only one instance runs
echo [PORT MANAGEMENT] Checking for existing processes on ports %BACKEND_PORT% and %FRONTEND_PORT%...
echo.

:: Kill processes on backend port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%BACKEND_PORT% ^| findstr LISTENING') do (
    echo [PORT MANAGEMENT] Killing existing process on port %BACKEND_PORT% (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill processes on frontend port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%FRONTEND_PORT% ^| findstr LISTENING') do (
    echo [PORT MANAGEMENT] Killing existing process on port %FRONTEND_PORT% (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

:: Function to check if a port is in use
:check_port
set PORT=%~1
netstat -an | findstr ":%PORT% " >nul
if !errorlevel! equ 0 (
    set PORT_IN_USE=1
) else (
    set PORT_IN_USE=0
)
goto :eof

:: Function to kill processes on a port
:kill_port
set PORT=%~1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORT% " ^| findstr LISTENING') do (
    echo Killing process %%a on port %PORT%
    taskkill /f /pid %%a >nul 2>&1
)
goto :eof

:: Check if we're in the correct directory
if not exist "%BACKEND_DIR%\manage.py" (
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

if not exist "%FRONTEND_DIR%\package.json" (
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
if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo WARNING: Virtual environment not found. Creating one...
    python -m venv %VENV_DIR%
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
call %VENV_DIR%\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment.
    echo.
    echo Troubleshooting:
    echo 1. Check if %VENV_DIR%\Scripts\activate.bat exists
    echo 2. Make sure you have permission to run batch files
    echo.
    pause
    exit /b 1
)

:: Check if Django is installed
python -c "import django; print('Django version:', django.get_version())" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Django and other Python dependencies...
    pip install -r %BACKEND_DIR%\requirements.txt
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
if not exist "%FRONTEND_DIR%\node_modules" (
    echo Installing Node.js dependencies...
    cd %FRONTEND_DIR%
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

:: Check if ports are already in use
echo Checking if ports are available...
call :check_port %BACKEND_PORT%
if !PORT_IN_USE! equ 1 (
    echo Port %BACKEND_PORT% is already in use.
    set /p KILL_BACKEND="Do you want to kill the process using port %BACKEND_PORT%? (y/n): "
    if /i "!KILL_BACKEND!"=="y" (
        call :kill_port %BACKEND_PORT%
        timeout /t 2 /nobreak >nul
    ) else (
        echo Please free up port %BACKEND_PORT% and try again.
        pause
        exit /b 1
    )
)

call :check_port %FRONTEND_PORT%
if !PORT_IN_USE! equ 1 (
    echo Port %FRONTEND_PORT% is already in use.
    set /p KILL_FRONTEND="Do you want to kill the process using port %FRONTEND_PORT%? (y/n): "
    if /i "!KILL_FRONTEND!"=="y" (
        call :kill_port %FRONTEND_PORT%
        timeout /t 2 /nobreak >nul
    ) else (
        echo Please free up port %FRONTEND_PORT% and try again.
        pause
        exit /b 1
    )
)

:: Start backend server
echo Starting Django backend server on port %BACKEND_PORT%...
start "Django Backend Server - Document Solutions" /D "%BACKEND_DIR%" cmd /k "title Django Backend Server & python manage.py runserver %BACKEND_PORT%"

:: Wait a few seconds for backend to start
echo Waiting for backend server to start...
timeout /t 8 /nobreak >nul

:: Check if backend server started successfully
call :check_port %BACKEND_PORT%
if !PORT_IN_USE! equ 1 (
    echo [BACKEND SERVER SUCCESS] Backend server started successfully on http://127.0.0.1:%BACKEND_PORT%
) else (
    echo [BACKEND SERVER WARNING] Backend server may not have started correctly.
    echo Troubleshooting:
    echo 1. Check the backend server console for error messages
    echo 2. Verify that Django is properly installed
    echo 3. Check if there are any database migration issues
    echo.
)

:: Start frontend server with custom environment to open browser
echo Starting React frontend server on port %FRONTEND_PORT%...
echo This may take a few seconds...

:: Set environment variable to automatically open browser
set BROWSER=none
start "React Frontend Server - Document Solutions" /D "%FRONTEND_DIR%" cmd /k "title React Frontend Server & set BROWSER=chrome && npm start"

:: Wait for frontend server to start
echo [FRONTEND SERVER] Waiting for frontend server to initialize...
timeout /t 15 /nobreak >nul

:: Check if frontend server started successfully
call :check_port %FRONTEND_PORT%
if !PORT_IN_USE! equ 1 (
    echo [FRONTEND SERVER SUCCESS] Frontend server started successfully on http://127.0.0.1:%FRONTEND_PORT%/
) else (
    echo [FRONTEND SERVER WARNING] Frontend server may not have started correctly.
    echo Troubleshooting:
    echo 1. Check if port %FRONTEND_PORT% is already in use
    echo 2. Verify that Node.js dependencies are installed
    echo 3. Check the frontend server console for error messages
    echo.
)

:: Open Chrome browser to the frontend URL
echo [BROWSER] Opening Chrome browser to http://127.0.0.1:%FRONTEND_PORT%/
timeout /t 3 /nobreak >nul

:: Try multiple methods to open Chrome with full path
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo [BROWSER] Using Chrome from Program Files
    "C:\Program Files\Google\Chrome\Application\chrome.exe" --new-window "http://127.0.0.1:%FRONTEND_PORT%/"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo [BROWSER] Using Chrome from Program Files (x86)
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --new-window "http://127.0.0.1:%FRONTEND_PORT%/"
) else (
    :: Fallback to just chrome.exe if in PATH
    echo [BROWSER] Using Chrome from PATH
    start chrome.exe "http://127.0.0.1:%FRONTEND_PORT%/"
)

echo.
echo ========================================
echo Development Servers Status
echo ========================================
echo Backend Server:   http://127.0.0.1:%BACKEND_PORT%
echo Frontend Server:  http://127.0.0.1:%FRONTEND_PORT%/
echo.
echo IMPORTANT INSTRUCTIONS:
echo ======================
echo 1. TWO NEW COMMAND WINDOWS HAVE BEEN OPENED:
echo    - Django Backend Server (port %BACKEND_PORT%)
echo    - React Frontend Server (port %FRONTEND_PORT%)
echo.
echo 2. THESE WINDOWS MUST REMAIN OPEN FOR THE SERVERS TO RUN
echo.
echo 3. TO STOP THE SERVERS:
echo    - Close the Django Backend Server window
echo    - Close the React Frontend Server window
echo.
echo 4. TO ACCESS YOUR APPLICATION:
echo    - Backend API: http://127.0.0.1:%BACKEND_PORT%
echo    - Frontend App: http://127.0.0.1:%FRONTEND_PORT%/
echo.
echo 5. THIS WINDOW CAN BE CLOSED SAFELY
echo    (Press any key to close this window only)
echo.
echo Servers are now running!
echo.
pause >nul
exit /b 0