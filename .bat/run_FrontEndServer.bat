@echo off
title Frontend Server - Document Solutions

:: Navigate to project root
cd /d "%~dp0.."

echo ========================================
echo Frontend Server - Document Solutions
echo ========================================
echo.

:: ========================================
:: STEP 1: CLOSE EXISTING FRONTEND SERVERS
:: ========================================
echo [1/4] Closing existing frontend servers...

:: Kill processes on port 3000 (frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo Closing frontend process on port 3000 (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill any Node processes that might be running React
for /f "tokens=2" %%a in ('tasklist ^| findstr node.exe 2^>nul') do (
    echo Closing Node process (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

:: Wait for processes to close
ping -n 3 127.0.0.1 >nul

:: Verify port 3000 is free
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 3000 still in use
) else (
    echo Port 3000 is now free
)

echo [1/4] Frontend cleanup completed.
echo.

:: ========================================
:: STEP 2: CHECK REQUIREMENTS
:: ========================================
echo [2/4] Checking frontend requirements...

:: Check if we're in the right directory
if not exist "frontend\package.json" (
    echo ERROR: Cannot find frontend\package.json
    echo Current directory: %CD%
    echo Please run this script from the .bat directory.
    pause
    exit /b 1
)

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js.
    pause
    exit /b 1
) else (
    echo Node.js found: 
    node --version
)

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm not found. Please install npm.
    pause
    exit /b 1
) else (
    echo npm found: 
    npm --version
)

echo [2/4] Frontend requirements check completed.
echo.

:: ========================================
:: STEP 3: INSTALL DEPENDENCIES
:: ========================================
echo [3/4] Installing frontend dependencies...

:: Check if node_modules exist
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        echo Check the error messages above for details.
        pause
        exit /b 1
    )
    cd ..
    echo Frontend dependencies installed successfully
) else (
    echo Frontend dependencies already installed
)

echo [3/4] Dependency installation completed.
echo.

:: ========================================
:: STEP 4: START FRONTEND SERVER
:: ========================================
echo [4/4] Starting frontend server...

:: Start React frontend server with BROWSER=none to prevent auto-opening
echo Starting React frontend server on port 3000...
start "React Frontend Server" /D "frontend" cmd /k "title React Frontend Server & set BROWSER=none && npm start"

:: Wait for frontend to start
echo Waiting for frontend server to initialize...
ping -n 15 127.0.0.1 >nul

:: Check if frontend server started successfully
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Frontend Server Started Successfully!
    echo ========================================
    echo.
    echo Frontend Server: http://127.0.0.1:3000
    echo.
    echo A new window opened with the React server.
    echo Keep that window open for the server to run.
    echo.
    
    :: ========================================
    :: OPEN CHROME BROWSER
    :: ========================================
    echo Opening Chrome browser...
    ping -n 2 127.0.0.1 >nul
    
    :: Try multiple methods to open Chrome
    echo Attempting to open Chrome...
    
    :: Method 1: Chrome from Program Files
    if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
        echo Using Chrome from Program Files
        "C:\Program Files\Google\Chrome\Application\chrome.exe" --new-window "http://127.0.0.1:3000/" 2>nul
        if %errorlevel% equ 0 (
            echo Chrome opened successfully
        ) else (
            echo Failed to open Chrome from Program Files
        )
    ) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
        echo Using Chrome from Program Files (x86)
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --new-window "http://127.0.0.1:3000/" 2>nul
        if %errorlevel% equ 0 (
            echo Chrome opened successfully
        ) else (
            echo Failed to open Chrome from Program Files (x86)
        )
    ) else (
        :: Method 2: Try chrome command
        echo Trying chrome command...
        start chrome "http://127.0.0.1:3000/" 2>nul
        if %errorlevel% equ 0 (
            echo Chrome opened via command
        ) else (
            echo Could not open Chrome automatically
            echo Please manually open: http://127.0.0.1:3000/
        )
    )
    
    echo.
    echo Chrome browser should now be open to http://127.0.0.1:3000
    echo.
    echo This window can be closed.
    echo.
) else (
    echo.
    echo ========================================
    echo Frontend Server Warning
    echo ========================================
    echo.
    echo Frontend server may not have started correctly.
    echo Check the React Frontend Server window for error messages.
    echo.
    echo Common issues:
    echo - Port 3000 still in use
    echo - Missing dependencies (run npm install)
    echo - React configuration error
    echo - Node.js version compatibility
    echo.
    echo Please check the React Frontend Server window for details.
    echo.
)

echo Press any key to close this window...
pause >nul
