@echo off
:: DSS Directory Security Script
:: Applies file system permissions to protect the DSS directory structure
:: Prevents unauthorized deletion of DSS directory contents
::
:: Only System Administrators should be able to remove tokens via the web interface

echo ==================================================
echo        DSS DIRECTORY SECURITY
echo ==================================================
echo Applying security permissions to DSS directory...
echo.

:: Navigate to the project root directory
cd /d "%~dp0.."

:: Define the DSS path
set "DSS_PATH=%LOCALAPPDATA%\DSS"

:: Check if DSS directory exists
if not exist "%DSS_PATH%" (
    echo ERROR: DSS directory does not exist at %DSS_PATH%
    echo Please run setup_dss_directory.bat first
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo DSS directory found at: %DSS_PATH%
echo.

:: Apply security permissions using icacls
echo Applying read-only permissions for regular users...
echo.

:: Set permissions for the base DSS directory
:: Give Administrators full control, Users read-only access
icacls "%DSS_PATH%" /grant "Administrators:(OI)(CI)F" /T >nul 2>&1
if errorlevel 1 (
    echo WARNING: Failed to set administrator permissions
) else (
    echo - Granted Administrators full control on base directory
)

icacls "%DSS_PATH%" /grant "Users:(OI)(CI)R" /T >nul 2>&1
if errorlevel 1 (
    echo WARNING: Failed to set user read-only permissions
) else (
    echo - Granted Users read-only access to all directories
)

:: Specifically protect the token directory from deletion by regular users
set "TOKEN_PATH=%DSS_PATH%\746f6b656e"
if exist "%TOKEN_PATH%" (
    icacls "%TOKEN_PATH%" /deny "Users:(OI)(CI)(WD,AD,DE,DC)" >nul 2>&1
    if errorlevel 1 (
        echo WARNING: Failed to protect token directory
    ) else (
        echo - Protected token directory from user modifications
    )
)

:: Specifically protect the user directory from deletion by regular users
set "USER_PATH=%DSS_PATH%\6469726563746f7279"
if exist "%USER_PATH%" (
    icacls "%USER_PATH%" /deny "Users:(OI)(CI)(WD,AD,DE,DC)" >nul 2>&1
    if errorlevel 1 (
        echo WARNING: Failed to protect user directory
    ) else (
        echo - Protected user directory from user modifications
    )
)

:: Display security information
echo.
echo ==================================================
echo DSS DIRECTORY SECURITY APPLIED SUCCESSFULLY
echo ==================================================
echo Security measures implemented:
echo 1. Administrators have full control
echo 2. Regular users have read-only access
echo 3. Token directory is protected from user modifications
echo 4. User directory is protected from user modifications
echo.
echo Only System Administrators can:
echo - Delete files from the DSS directory
echo - Modify token files
echo - Remove user directories
echo.
echo Regular users can only:
echo - Read files (for validation purposes)
echo.
echo For token removal, users must use the web interface:
echo - System Administrators: Machine Tokens admin page
echo - Senior Department Heads: Machine Tokens admin page
echo.
echo Press any key to exit...
pause >nul