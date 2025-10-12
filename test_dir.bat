@echo off
echo ========================================
echo Document Solutions - Directory Diagnostic
echo ========================================
echo.
echo Current directory: %CD%
echo.
echo Environment variables:
echo CD = %CD%
echo PWD = %PWD% (if set)
echo.
echo Checking file existence with different methods:
echo.
echo Method 1 - Direct check:
if exist "backend\manage.py" (
    echo [PASS] backend\manage.py exists
) else (
    echo [FAIL] backend\manage.py does not exist
)
if exist "frontend\package.json" (
    echo [PASS] frontend\package.json exists
) else (
    echo [FAIL] frontend\package.json does not exist
)
echo.
echo Method 2 - Using CD to check:
cd backend >nul 2>&1
if exist "manage.py" (
    echo [PASS] manage.py exists in backend directory
) else (
    echo [FAIL] manage.py does not exist in backend directory
)
cd .. >nul 2>&1
cd frontend >nul 2>&1
if exist "package.json" (
    echo [PASS] package.json exists in frontend directory
) else (
    echo [FAIL] package.json does not exist in frontend directory
)
cd .. >nul 2>&1
echo.
echo Method 3 - Full path check:
if exist "D:\PYTHON\Projects\Django\DSS\backend\manage.py" (
    echo [PASS] Full path to backend\manage.py exists
) else (
    echo [FAIL] Full path to backend\manage.py does not exist
)
if exist "D:\PYTHON\Projects\Django\DSS\frontend\package.json" (
    echo [PASS] Full path to frontend\package.json exists
) else (
    echo [FAIL] Full path to frontend\package.json does not exist
)
echo.
echo Directory structure:
echo.
echo Backend directory:
dir backend /b
echo.
echo Frontend directory:
dir frontend /b
echo.
echo Press any key to continue...
pause >nul