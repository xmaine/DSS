@echo off
:: DSS Running Process Protection Script
:: Applies additional file system protections to the DSS directory
:: while backend (port 8000) and frontend (port 3000) servers are running
::
:: This script should be run before attempting to delete the DSS directory
:: to prevent accidental deletion while servers are active

echo ==================================================
echo        DSS DIRECTORY PROTECTION
echo ==================================================
echo Checking if DSS servers are running...
echo.

:: Define the DSS path
set "DSS_PATH=%LOCALAPPDATA%\DSS"

:: Check if DSS directory exists
if not exist "%DSS_PATH%" (
    echo INFO: DSS directory does not exist at %DSS_PATH%
    echo No protection needed.
    echo.
    exit /b 0
)

echo DSS directory found at: %DSS_PATH%
echo.

:: Check if backend server (port 8000) is running
echo Checking for backend server on port 8000...
netstat -an | findstr ":8000 " | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [ACTIVE] Backend server is running on port 8000
    set "BACKEND_RUNNING=1"
) else (
    echo [INACTIVE] Backend server is not running on port 8000
    set "BACKEND_RUNNING=0"
)

:: Check if frontend server (port 3000) is running
echo Checking for frontend server on port 3000...
netstat -an | findstr ":3000 " | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [ACTIVE] Frontend server is running on port 3000
    set "FRONTEND_RUNNING=1"
) else (
    echo [INACTIVE] Frontend server is not running on port 3000
    set "FRONTEND_RUNNING=0"
)

:: If either server is running, apply additional protections
if "%BACKEND_RUNNING%"=="1" (
    echo.
    echo Applying additional protection while backend server is running...
    call :APPLY_PROTECTION
    exit /b 1
)

if "%FRONTEND_RUNNING%"=="1" (
    echo.
    echo Applying additional protection while frontend server is running...
    call :APPLY_PROTECTION
    exit /b 1
)

echo.
echo No servers are currently running. DSS directory can be safely managed.
echo.
exit /b 0

:APPLY_PROTECTION
:: Apply additional file system protections when servers are running
echo.
echo Applying additional file system protections to prevent deletion...
echo.

:: Set additional protections for the base DSS directory
:: Give Administrators full control, deny all access to Users except read
icacls "%DSS_PATH%" /grant "Administrators:(OI)(CI)F" /T >nul 2>&1
if errorlevel 1 (
    echo WARNING: Failed to set administrator permissions
) else (
    echo - Granted Administrators full control on base directory
)

icacls "%DSS_PATH%" /deny "Users:(OI)(CI)(WD,AD,DE,DC)" /T >nul 2>&1
if errorlevel 1 (
    echo WARNING: Failed to set user deny permissions
) else (
    echo - Denied Users write, delete, and modify access to all directories
)

:: Specifically protect the token directory from any user modifications
set "TOKEN_PATH=%DSS_PATH%\746f6b656e"
if exist "%TOKEN_PATH%" (
    icacls "%TOKEN_PATH%" /deny "Users:(OI)(CI)(WD,AD,DE,DC)" >nul 2>&1
    if errorlevel 1 (
        echo WARNING: Failed to protect token directory
    ) else (
        echo - Additional protection applied to token directory
    )
)

:: Specifically protect the user directory from any user modifications
set "USER_PATH=%DSS_PATH%\6469726563746f7279"
if exist "%USER_PATH%" (
    icacls "%USER_PATH%" /deny "Users:(OI)(CI)(WD,AD,DE,DC)" >nul 2>&1
    if errorlevel 1 (
        echo WARNING: Failed to protect user directory
    ) else (
        echo - Additional protection applied to user directory
    )
)

echo.
echo ==================================================
echo DSS DIRECTORY PROTECTION APPLIED
echo ==================================================
echo Additional protections implemented while servers are running:
echo 1. Administrators have full control
echo 2. Regular users have NO write/delete/modify access
echo 3. Token directory is protected from all user modifications
echo 4. User directory is protected from all user modifications
echo.
echo To safely manage the DSS directory:
echo 1. Stop all servers using stop_all_servers.bat
echo 2. Then manage the directory as needed
echo 3. Run secure_dss_directory.bat to restore normal permissions
echo.
echo Press any key to exit...
pause >nul
exit /b 0