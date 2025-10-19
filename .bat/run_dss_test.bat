@echo off
:: DSS Directory Setup Test Script
:: Runs the Node.js test script to create the DSS directory structure

echo [DSS DIRECTORY SETUP TEST]
echo This script will create the DSS directory structure in:
echo C:\Users\Default\AppData\Local\DSS\
echo.

:: Navigate to the project root directory
cd /d "%~dp0.."

:: Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js to run this test
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo Node.js version: 
for /f "tokens=*" %%i in ('node --version') do echo %%i
echo.

echo Running DSS directory setup test...
echo.

:: Run the Node.js test script
node .bat/test_dss_setup.js

echo.
echo Test completed!
echo.
echo Press any key to exit...
pause >nul