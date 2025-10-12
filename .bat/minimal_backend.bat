@echo off
echo ========================================
echo Minimal Backend Test
echo ========================================
echo.

:: Navigate to project root
cd /d "%~dp0.."
echo Current directory: %CD%

:: Check if backend exists
if exist "backend\manage.py" (
    echo Backend directory found
) else (
    echo ERROR: Backend directory not found
    echo Current directory contents:
    dir /b
    pause
    exit /b 1
)

:: Check Python
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found
    pause
    exit /b 1
)

:: Try to start Django
echo Starting Django server...
cd backend
python manage.py runserver 8000

pause
