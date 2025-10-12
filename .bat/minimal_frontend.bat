@echo off
echo ========================================
echo Minimal Frontend Test
echo ========================================
echo.

:: Navigate to project root
cd /d "%~dp0.."
echo Current directory: %CD%

:: Check if frontend exists
if exist "frontend\package.json" (
    echo Frontend directory found
) else (
    echo ERROR: Frontend directory not found
    echo Current directory contents:
    dir /b
    pause
    exit /b 1
)

:: Check Node
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    pause
    exit /b 1
)

:: Try to start React
echo Starting React server...
cd frontend
set BROWSER=none
npm start

pause
