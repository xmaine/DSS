@echo off
:: Navigate to the project root directory (parent of .bat directory)
cd /d "%~dp0.."

echo Testing file detection...
echo Current directory: %CD%
echo.

echo Checking for backend directory:
if exist "backend" (
    echo ^> backend directory exists
) else (
    echo ^> backend directory does NOT exist
)

echo Checking for backend\manage.py:
if exist "backend\manage.py" (
    echo ^> backend\manage.py exists
) else (
    echo ^> backend\manage.py does NOT exist
)

echo Checking for frontend directory:
if exist "frontend" (
    echo ^> frontend directory exists
) else (
    echo ^> frontend directory does NOT exist
)

echo Checking for frontend\package.json:
if exist "frontend\package.json" (
    echo ^> frontend\package.json exists
) else (
    echo ^> frontend\package.json does NOT exist
)

echo.
echo Directory listing:
dir /b
echo.
echo Backend directory listing:
dir backend /b
echo.
echo Frontend directory listing:
dir frontend /b
pause