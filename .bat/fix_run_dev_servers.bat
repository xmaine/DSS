@echo off
setlocal enabledelayedexpansion

title Document Solutions - Fix & Run Development Servers

:: Navigate to the project root directory (parent of .bat directory)
cd /d "%~dp0.."

:: Configuration
set BACKEND_PORT=8000
set FRONTEND_PORT=3000
set BACKEND_DIR=backend
set FRONTEND_DIR=frontend
set VENV_DIR=venv

echo ========================================
echo Document Solutions - Fix & Run Dev Servers
echo Enhanced Debugging & Server Management
echo ========================================
echo.

:: Enhanced debugging information
echo [DEBUG] Script started at: %date% %time%
echo [DEBUG] Current working directory: %CD%
echo [DEBUG] Script location: %~dp0
echo [DEBUG] Full script path: %~f0
echo.

:: ========================================
:: STEP 1: COMPREHENSIVE SYSTEM SCAN
:: ========================================
echo [SCAN] Starting comprehensive system scan...
echo.

:: Check system requirements
echo [SCAN] Checking system requirements...
echo [SCAN] Python version:
python --version 2>nul || echo [SCAN ERROR] Python not found
echo [SCAN] Node.js version:
node --version 2>nul || echo [SCAN ERROR] Node.js not found
echo [SCAN] npm version:
npm --version 2>nul || echo [SCAN ERROR] npm not found
echo.

:: Check project structure
echo [SCAN] Checking project structure...
if exist "%BACKEND_DIR%\manage.py" (
    echo [SCAN SUCCESS] Backend directory structure: OK
) else (
    echo [SCAN ERROR] Backend directory structure: MISSING
    echo [SCAN ERROR] Cannot find %BACKEND_DIR%\manage.py
    echo [SCAN ERROR] Current directory: %CD%
    echo [SCAN ERROR] Directory contents:
    dir /b
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're in the project root directory
    echo 2. Check that the backend directory exists with manage.py file
    echo.
    pause
    exit /b 1
)

if exist "%FRONTEND_DIR%\package.json" (
    echo [SCAN SUCCESS] Frontend directory structure: OK
) else (
    echo [SCAN ERROR] Frontend directory structure: MISSING
    echo [SCAN ERROR] Cannot find %FRONTEND_DIR%\package.json
    echo [SCAN ERROR] Current directory: %CD%
    echo [SCAN ERROR] Directory contents:
    dir /b
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're in the project root directory
    echo 2. Check that the frontend directory exists with package.json file
    echo.
    pause
    exit /b 1
)

:: Check virtual environment
if exist "%VENV_DIR%\Scripts\activate.bat" (
    echo [SCAN SUCCESS] Virtual environment: FOUND
) else (
    echo [SCAN WARNING] Virtual environment: NOT FOUND
)

:: Check node_modules
if exist "%FRONTEND_DIR%\node_modules" (
    echo [SCAN SUCCESS] Node modules: FOUND
) else (
    echo [SCAN WARNING] Node modules: NOT FOUND
)

echo [SCAN] System scan completed.
echo.

:: ========================================
:: STEP 2: FORCE CLOSE ALL EXISTING SERVERS
:: ========================================
echo [CLEANUP] Force closing all existing servers...
echo.

:: Kill processes on backend port
echo [CLEANUP] Checking for processes on port %BACKEND_PORT%...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%BACKEND_PORT% " ^| findstr LISTENING 2^>nul') do (
    echo [CLEANUP] Killing process on port %BACKEND_PORT% (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill processes on frontend port
echo [CLEANUP] Checking for processes on port %FRONTEND_PORT%...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%FRONTEND_PORT% " ^| findstr LISTENING 2^>nul') do (
    echo [CLEANUP] Killing process on port %FRONTEND_PORT% (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill any Python processes that might be running Django
echo [CLEANUP] Checking for Python processes...
for /f "tokens=2" %%a in ('tasklist ^| findstr python.exe 2^>nul') do (
    echo [CLEANUP] Killing Python process (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill any Node processes that might be running React
echo [CLEANUP] Checking for Node.js processes...
for /f "tokens=2" %%a in ('tasklist ^| findstr node.exe 2^>nul') do (
    echo [CLEANUP] Killing Node.js process (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Additional cleanup - kill any cmd windows with server titles
echo [CLEANUP] Checking for server command windows...
for /f "tokens=2" %%a in ('tasklist ^| findstr cmd.exe 2^>nul') do (
    wmic process where "ProcessId=%%a" get CommandLine 2>nul | findstr /i "django\|react\|server" >nul
    if !errorlevel! equ 0 (
        echo [CLEANUP] Killing server command window (PID: %%a)
        taskkill /f /pid %%a >nul 2>&1
    )
)

:: Wait for processes to terminate
echo [CLEANUP] Waiting for processes to terminate...
ping -n 4 127.0.0.1 >nul

:: Verify ports are free
echo [CLEANUP] Verifying ports are free...
netstat -an | findstr ":%BACKEND_PORT% " >nul
if %errorlevel% equ 0 (
    echo [CLEANUP WARNING] Port %BACKEND_PORT% still in use
) else (
    echo [CLEANUP SUCCESS] Port %BACKEND_PORT% is free
)

netstat -an | findstr ":%FRONTEND_PORT% " >nul
if %errorlevel% equ 0 (
    echo [CLEANUP WARNING] Port %FRONTEND_PORT% still in use
) else (
    echo [CLEANUP SUCCESS] Port %FRONTEND_PORT% is free
)

echo [CLEANUP] Server cleanup completed.
echo.

:: ========================================
:: STEP 3: ENVIRONMENT SETUP
:: ========================================
echo [SETUP] Setting up development environment...
echo.

:: Check if Python is available
echo [SETUP] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [SETUP ERROR] Python is not installed or not in PATH.
    echo.
    echo Troubleshooting:
    echo 1. Install Python from https://www.python.org/downloads/
    echo 2. Make sure Python is added to your system PATH
    echo 3. Restart your command prompt after installing Python
    echo.
    pause
    exit /b 1
) else (
    echo [SETUP SUCCESS] Python is available
    python --version
)

:: Check if Node.js is available
echo [SETUP] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [SETUP ERROR] Node.js is not installed or not in PATH.
    echo.
    echo Troubleshooting:
    echo 1. Install Node.js from https://nodejs.org/
    echo 2. Make sure Node.js is added to your system PATH
    echo 3. Restart your command prompt after installing Node.js
    echo.
    pause
    exit /b 1
) else (
    echo [SETUP SUCCESS] Node.js is available
    node --version
)

:: Create virtual environment if it doesn't exist
echo [SETUP] Checking virtual environment...
if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo [SETUP] Creating virtual environment...
    python -m venv %VENV_DIR%
    if %errorlevel% neq 0 (
        echo [SETUP ERROR] Failed to create virtual environment.
        echo.
        echo Troubleshooting:
        echo 1. Make sure you have permission to create directories in this location
        echo 2. Check if Python venv module is available
        echo.
        pause
        exit /b 1
    )
    echo [SETUP SUCCESS] Virtual environment created successfully.
) else (
    echo [SETUP SUCCESS] Virtual environment found
)

:: Activate virtual environment
echo [SETUP] Activating virtual environment...
call %VENV_DIR%\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [SETUP ERROR] Failed to activate virtual environment.
    echo.
    echo Troubleshooting:
    echo 1. Check if %VENV_DIR%\Scripts\activate.bat exists
    echo 2. Make sure you have permission to run batch files
    echo.
    pause
    exit /b 1
) else (
    echo [SETUP SUCCESS] Virtual environment activated
)

:: Install Python dependencies
echo [SETUP] Checking Python dependencies...
python -c "import django; print('Django version:', django.get_version())" >nul 2>&1
if %errorlevel% neq 0 (
    echo [SETUP] Installing Python dependencies...
    pip install -r %BACKEND_DIR%\requirements.txt
    if %errorlevel% neq 0 (
        echo [SETUP ERROR] Failed to install Python dependencies.
        echo.
        echo Troubleshooting:
        echo 1. Check your internet connection
        echo 2. Verify that requirements.txt exists and is valid
        echo 3. Make sure you have permission to install packages
        echo.
        pause
        exit /b 1
    )
    echo [SETUP SUCCESS] Python dependencies installed successfully.
) else (
    echo [SETUP SUCCESS] Python dependencies are installed
    python -c "import django; print('Django version:', django.get_version())"
)

:: Install Node.js dependencies
echo [SETUP] Checking Node.js dependencies...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [SETUP] Installing Node.js dependencies...
    cd %FRONTEND_DIR%
    npm install
    if %errorlevel% neq 0 (
        echo [SETUP ERROR] Failed to install Node.js dependencies.
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
    echo [SETUP SUCCESS] Node.js dependencies installed successfully.
) else (
    echo [SETUP SUCCESS] Node.js dependencies are installed
)

echo [SETUP] Environment setup completed.
echo.

:: ========================================
:: STEP 4: START BACKEND SERVER
:: ========================================
echo [BACKEND] Starting Django backend server...
echo [BACKEND] This may take a few seconds...

:: Start backend server in a new window
start "Django Backend Server - Document Solutions" /D "%BACKEND_DIR%" cmd /k "title Django Backend Server & python manage.py runserver %BACKEND_PORT%"

:: Wait for backend to start
echo [BACKEND] Waiting for backend server to initialize...
ping -n 9 127.0.0.1 >nul

:: Check if backend server started successfully
netstat -an | findstr ":%BACKEND_PORT% " >nul
if %errorlevel% equ 0 (
    echo [BACKEND SUCCESS] Backend server started successfully on http://127.0.0.1:%BACKEND_PORT%
) else (
    echo [BACKEND WARNING] Backend server may not have started correctly.
    echo [BACKEND TROUBLESHOOTING] Check the backend server console for error messages
    echo [BACKEND TROUBLESHOOTING] Common issues: database migrations, port conflicts, Django configuration
)

echo.

:: ========================================
:: STEP 5: START FRONTEND SERVER
:: ========================================
echo [FRONTEND] Starting React frontend server...
echo [FRONTEND] This may take a few seconds...

:: Set environment variable to prevent automatic browser opening
set BROWSER=none

:: Start frontend server in a new window
start "React Frontend Server - Document Solutions" /D "%FRONTEND_DIR%" cmd /k "title React Frontend Server & set BROWSER=none && npm start"

:: Wait for frontend to start
echo [FRONTEND] Waiting for frontend server to initialize...
ping -n 16 127.0.0.1 >nul

:: Check if frontend server started successfully
netstat -an | findstr ":%FRONTEND_PORT% " >nul
if %errorlevel% equ 0 (
    echo [FRONTEND SUCCESS] Frontend server started successfully on http://127.0.0.1:%FRONTEND_PORT%/
) else (
    echo [FRONTEND WARNING] Frontend server may not have started correctly.
    echo [FRONTEND TROUBLESHOOTING] Check the frontend server console for error messages
    echo [FRONTEND TROUBLESHOOTING] Common issues: port conflicts, missing dependencies, React configuration
)

echo.

:: ========================================
:: STEP 6: OPEN BROWSER
:: ========================================
echo [BROWSER] Opening Chrome browser to localhost...
ping -n 4 127.0.0.1 >nul

:: Try multiple methods to open Chrome
echo [BROWSER] Attempting to open Chrome browser...

:: Method 1: Chrome from Program Files
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo [BROWSER] Using Chrome from Program Files
    "C:\Program Files\Google\Chrome\Application\chrome.exe" --new-window "http://127.0.0.1:%FRONTEND_PORT%/" 2>nul
    if %errorlevel% equ 0 (
        echo [BROWSER SUCCESS] Chrome opened successfully
    ) else (
        echo [BROWSER WARNING] Failed to open Chrome from Program Files
    )
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo [BROWSER] Using Chrome from Program Files (x86)
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --new-window "http://127.0.0.1:%FRONTEND_PORT%/" 2>nul
    if %errorlevel% equ 0 (
        echo [BROWSER SUCCESS] Chrome opened successfully
    ) else (
        echo [BROWSER WARNING] Failed to open Chrome from Program Files (x86)
    )
) else (
    :: Method 2: Chrome from PATH
    echo [BROWSER] Using Chrome from PATH
    start chrome.exe "http://127.0.0.1:%FRONTEND_PORT%/" 2>nul
    if %errorlevel% equ 0 (
        echo [BROWSER SUCCESS] Chrome opened successfully
    ) else (
        echo [BROWSER WARNING] Failed to open Chrome from PATH
        echo [BROWSER INFO] You can manually open: http://127.0.0.1:%FRONTEND_PORT%/
    )
)

echo.

:: ========================================
:: STEP 7: FINAL STATUS REPORT
:: ========================================
echo ========================================
echo Document Solutions - Server Status Report
echo ========================================
echo.
echo [STATUS] Backend Server:   http://127.0.0.1:%BACKEND_PORT%
echo [STATUS] Frontend Server:  http://127.0.0.1:%FRONTEND_PORT%/
echo [STATUS] Browser:          Chrome (if available)
echo.

:: Final port verification
echo [VERIFICATION] Final port verification...
netstat -an | findstr ":%BACKEND_PORT% " >nul
if %errorlevel% equ 0 (
    echo [VERIFICATION SUCCESS] Backend server is running on port %BACKEND_PORT%
) else (
    echo [VERIFICATION WARNING] Backend server may not be running on port %BACKEND_PORT%
)

netstat -an | findstr ":%FRONTEND_PORT% " >nul
if %errorlevel% equ 0 (
    echo [VERIFICATION SUCCESS] Frontend server is running on port %FRONTEND_PORT%
) else (
    echo [VERIFICATION WARNING] Frontend server may not be running on port %FRONTEND_PORT%
)

echo.
echo ========================================
echo IMPORTANT INSTRUCTIONS
echo ========================================
echo.
echo 1. TWO NEW COMMAND WINDOWS HAVE BEEN OPENED:
echo    - Django Backend Server (port %BACKEND_PORT%)
echo    - React Frontend Server (port %FRONTEND_PORT%)
echo.
echo 2. THESE WINDOWS MUST REMAIN OPEN FOR THE SERVERS TO RUN
echo.
echo 3. TO STOP THE SERVERS:
echo    - Close the Django Backend Server window
echo    - Close the React Frontend Server window
echo    - Or run: stop_all_servers.bat
echo.
echo 4. SECURITY NOTE:
echo    - While servers are running, the DSS directory is protected from deletion
echo    - Run protect_dss_while_running.bat to verify protections are active
echo    - Stop servers before attempting to modify the DSS directory structure
echo.
echo 4. TO ACCESS YOUR APPLICATION:
echo    - Backend API: http://127.0.0.1:%BACKEND_PORT%
echo    - Frontend App: http://127.0.0.1:%FRONTEND_PORT%/
echo.
echo 5. THIS WINDOW CAN BE CLOSED SAFELY
echo    (Press any key to close this window only)
echo.
echo 6. FOR DEBUGGING:
echo    - Check the server console windows for error messages
echo    - Verify both servers are running on their respective ports
echo    - Check browser console for frontend errors
echo.

echo [COMPLETION] Fix and run process completed at: %date% %time%
echo.
pause >nul
exit /b 0
