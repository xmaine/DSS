@echo on
:: Navigate to the project root directory (parent of .bat directory)
cd /d "%~dp0.."

echo Current directory: %CD%
echo.
echo Checking backend directory...
if exist "backend" echo Backend directory exists
if exist "backend\manage.py" echo manage.py exists
echo.
echo Checking frontend directory...
if exist "frontend" echo Frontend directory exists
if exist "frontend\package.json" echo package.json exists
echo.
pause