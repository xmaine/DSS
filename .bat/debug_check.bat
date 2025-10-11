@echo off
echo ========================================
echo Document Solutions - Debug File Check
echo ========================================
echo.
echo Current directory: %CD%
echo.
echo Checking file existence with multiple methods:
echo.
echo Method 1 - Direct path check:
if exist "backend\manage.py" (
    echo [SUCCESS] backend\manage.py EXISTS
) else (
    echo [FAILURE] backend\manage.py DOES NOT EXIST
)
echo.
echo Method 2 - Full path check:
if exist "D:\PYTHON\Projects\Django\DSS\backend\manage.py" (
    echo [SUCCESS] Full path to backend\manage.py EXISTS
) else (
    echo [FAILURE] Full path to backend\manage.py DOES NOT EXIST
)
echo.
echo Method 3 - Directory contents check:
echo Backend directory contents:
dir backend /b
echo.
echo Method 4 - Change directory and check:
cd backend
if exist "manage.py" (
    echo [SUCCESS] manage.py EXISTS in current directory
) else (
    echo [FAILURE] manage.py DOES NOT EXIST in current directory
)
cd ..
echo.
echo Method 5 - Check with quotes:
if exist "backend\manage.py" (
    echo [SUCCESS] "backend\manage.py" EXISTS
) else (
    echo [FAILURE] "backend\manage.py" DOES NOT EXIST
)
echo.
echo Press any key to continue...
pause >nul