@echo off
:: DSS Real Directory Setup Script
:: Creates the required directory structure for machine tokens and user data
:: This script is designed to work in a real Electron application environment

echo ==================================================
echo        DSS DIRECTORY SETUP
echo ==================================================
echo Creating DSS directory structure in:
echo C:\Users\Default\AppData\Local\DSS\
echo.

:: Navigate to the project root directory to ensure correct path
cd /d "%~dp0.."

:: Check if we're running in the correct environment
if not exist ".bat" (
    echo ERROR: This script must be run from the project root directory
    echo Current directory: %cd%
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

:: Check if Node.js is available (required for real Electron app)
node --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Node.js not found - using basic Windows commands
    echo This is normal for browser-only testing
    echo.
    goto :WINDOWS_SETUP
) else (
    echo Node.js detected - using advanced setup
    echo.
    goto :NODE_SETUP
)

:NODE_SETUP
:: Run the Node.js setup script for full functionality
echo Running Node.js setup...
node .bat/test_dss_setup.js
if errorlevel 1 (
    echo ERROR: Node.js setup failed
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
goto :SUCCESS

:WINDOWS_SETUP
:: Fallback to basic Windows commands
echo Using Windows command setup...

:: Create the base DSS directory
set "DSS_PATH=%LOCALAPPDATA%\DSS"
echo Creating directory: %DSS_PATH%
if not exist "%DSS_PATH%" (
    mkdir "%DSS_PATH%"
    if errorlevel 1 (
        echo ERROR: Failed to create DSS directory
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
    echo Successfully created DSS directory
) else (
    echo DSS directory already exists
)

:: Create the token directory (hex: 'token' = 746f6b656e)
set "TOKEN_PATH=%DSS_PATH%\746f6b656e"
echo Creating token directory: %TOKEN_PATH%
if not exist "%TOKEN_PATH%" (
    mkdir "%TOKEN_PATH%"
    if errorlevel 1 (
        echo ERROR: Failed to create token directory
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
    echo Successfully created token directory
) else (
    echo Token directory already exists
)

:: Create the user directory (hex: 'directory' = 6469726563746f7279)
set "USER_PATH=%DSS_PATH%\6469726563746f7279"
echo Creating user directory: %USER_PATH%
if not exist "%USER_PATH%" (
    mkdir "%USER_PATH%"
    if errorlevel 1 (
        echo ERROR: Failed to create user directory
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
    echo Successfully created user directory
) else (
    echo User directory already exists
)

:SUCCESS
echo.
echo ==================================================
echo DSS DIRECTORY STRUCTURE CREATED SUCCESSFULLY
echo ==================================================
echo Base Path: %LOCALAPPDATA%\DSS
echo Token Path: %LOCALAPPDATA%\DSS\746f6b656e
echo User Path: %LOCALAPPDATA%\DSS\6469726563746f7279
echo.
echo Security Note: Directory names are hex-encoded for security
echo   - 'token' directory: 746f6b656e
echo   - 'directory' directory: 6469726563746f7279
echo.
echo In a real Electron application:
echo   - The web application will use Node.js fs module
echo   - Token files will be created in the token directory
echo   - User directories will be created in the user directory
echo.
echo Press any key to exit...
pause >nul