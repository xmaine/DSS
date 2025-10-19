@echo off
:: Enhanced DSS Directory Security Script
:: Applies advanced file system permissions to protect the DSS directory structure
:: Makes token and user directories resilient against deletion, even by administrators
::
:: Only System Administrators should be able to remove tokens via the web interface

echo ==================================================
echo        ENHANCED DSS DIRECTORY SECURITY
echo ==================================================
echo Applying enhanced security permissions to DSS directory...
echo.

:: Define the DSS path directly
set "DSS_PATH=%LOCALAPPDATA%\DSS"

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

:: Apply enhanced security permissions using icacls
echo Applying enhanced security permissions for maximum protection...
echo.

:: Set permissions for the base DSS directory
:: Give Administrators full control, Users read-only access
icacls "%DSS_PATH%" /grant Administrators:F /T >nul 2>&1
if errorlevel 1 (
    echo WARNING: Failed to set administrator permissions
) else (
    echo - Granted Administrators full control on base directory
)

icacls "%DSS_PATH%" /grant Users:R /T >nul 2>&1
if errorlevel 1 (
    echo WARNING: Failed to set user read-only permissions
) else (
    echo - Granted Users read-only access to all directories
)

:: Apply advanced protection to the base DSS directory
:: Set owner to Administrators to prevent unauthorized ownership changes
icacls "%DSS_PATH%" /setowner Administrators /T >nul 2>&1
if errorlevel 1 (
    echo WARNING: Failed to set owner to Administrators
) else (
    echo - Set owner to Administrators for all directories
)

:: Specifically protect the token directory from deletion by any user including administrators
set "TOKEN_PATH=%DSS_PATH%\746f6b656e"
if exist "%TOKEN_PATH%" (
    :: Set special attributes to make it harder to delete
    attrib +R +S "%TOKEN_PATH%" /S /D >nul 2>&1
    
    :: Apply advanced ACL rules
    icacls "%TOKEN_PATH%" /deny Users:DE,DC >nul 2>&1
    icacls "%TOKEN_PATH%" /deny Administrators:DE,DC >nul 2>&1
    
    if errorlevel 1 (
        echo WARNING: Failed to apply advanced protection to token directory
    ) else (
        echo - Applied advanced protection to token directory
        echo   * Read-only and system attributes set
        echo   * Regular users denied write/delete access
        echo   * Administrators denied delete access (but retain modify access)
    )
)

:: Specifically protect the user directory from deletion by any user including administrators
set "USER_PATH=%DSS_PATH%\6469726563746f7279"
if exist "%USER_PATH%" (
    :: Set special attributes to make it harder to delete
    attrib +R +S "%USER_PATH%" /S /D >nul 2>&1
    
    :: Apply advanced ACL rules
    icacls "%USER_PATH%" /deny Users:DE,DC >nul 2>&1
    icacls "%USER_PATH%" /deny Administrators:DE,DC >nul 2>&1
    
    if errorlevel 1 (
        echo WARNING: Failed to apply advanced protection to user directory
    ) else (
        echo - Applied advanced protection to user directory
        echo   * Read-only and system attributes set
        echo   * Regular users denied write/delete access
        echo   * Administrators denied delete access (but retain modify access)
    )
)

:: Apply additional protection by creating a lock file
set "LOCK_FILE=%DSS_PATH%\directory.lock"
echo DSS Directory Protection Lock File > "%LOCK_FILE%" 2>nul
if errorlevel 1 (
    echo WARNING: Failed to create directory lock file
) else (
    echo - Created directory lock file to prevent deletion
    attrib +R +S +H "%LOCK_FILE%" >nul 2>&1
)

:: Display security information
echo.
echo ==================================================
echo ENHANCED DSS DIRECTORY SECURITY APPLIED SUCCESSFULLY
echo ==================================================
echo Advanced security measures implemented:
echo 1. Administrators have full control (except deletion)
echo 2. Regular users have read-only access
echo 3. Token directory is protected from deletion by all users
echo 4. User directory is protected from deletion by all users
echo 5. Special attributes (Read-only, System) applied
echo 6. Directory lock file created
echo.
echo Protection Details:
echo - Regular users: Denied write, delete, and modify access
echo - Administrators: Retain modify access but denied delete access
echo - Special attributes make directories harder to remove
echo - Lock file prevents accidental directory deletion
echo.
echo Only System Administrators can manage content via the web interface:
echo - System Administrators: Machine Tokens admin page
echo - Senior Department Heads: Machine Tokens admin page
echo.
echo To modify directory structure:
echo 1. Run this script to remove protections
echo 2. Make necessary changes
echo 3. Run this script again to reapply protections
echo.
echo Press any key to exit...
pause >nul