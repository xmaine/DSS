@echo off
echo Current directory: %CD%
echo.
echo Testing file existence:
if exist "backend\manage.py" (
    echo SUCCESS: backend\manage.py found
) else (
    echo ERROR: backend\manage.py NOT found
)
if exist "frontend\package.json" (
    echo SUCCESS: frontend\package.json found
) else (
    echo ERROR: frontend\package.json NOT found
)
echo.
echo Press any key to continue...
pause >nul