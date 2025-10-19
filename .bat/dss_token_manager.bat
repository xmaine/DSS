@echo off
:: DSS Token Manager Script
:: Manages machine tokens for the Document Solutions System
:: Path: C:\Users\Default\AppData\Local\DSS\

set "DSS_PATH=%LOCALAPPDATA%\DSS"
set "TOKEN_PATH=%DSS_PATH%\746f6b656e"
set "USER_PATH=%DSS_PATH%\6469726563746f7279"

:MENU
cls
echo ==================================================
echo        DSS TOKEN MANAGER
echo ==================================================
echo Current DSS Path: %DSS_PATH%
echo.
echo 1. Setup DSS Directory Structure
echo 2. List Active Tokens
echo 3. Remove Specific Token
echo 4. Remove All Tokens (Admin Only)
echo 5. Show Directory Structure
echo 6. Apply Runtime Protection (While Servers Running)
echo 7. Apply Enhanced Security (Maximum Protection)
echo 8. Exit
echo.
echo Note: Directory names are hex-encoded for security
echo   - 'token' directory: 746f6b656e
echo   - 'directory' directory: 6469726563746f7279
echo.
choice /c 12345678 /m "Select an option"
if errorlevel 8 goto EXIT
if errorlevel 7 goto APPLY_ENHANCED_SECURITY
if errorlevel 6 goto APPLY_PROTECTION
if errorlevel 5 goto SHOW_STRUCTURE
if errorlevel 4 goto REMOVE_ALL
if errorlevel 3 goto REMOVE_TOKEN
if errorlevel 2 goto LIST_TOKENS
if errorlevel 1 goto SETUP_DIR

:SETUP_DIR
echo.
echo Setting up DSS directory structure...
call :CREATE_DSS_STRUCTURE
echo.
echo Press any key to continue...
pause >nul
goto MENU

:LIST_TOKENS
echo.
echo Listing active tokens...
if exist "%TOKEN_PATH%" (
    echo.
    echo Active Tokens in %TOKEN_PATH%:
    echo ----------------------------------------
    for %%f in ("%TOKEN_PATH%\*.token") do (
        echo %%~nf.token
        type "%%f"
        echo.
        echo ----------------------------------------
    )
    if not exist "%TOKEN_PATH%\*.token" (
        echo No tokens found.
    )
) else (
    echo Token directory does not exist. Run setup first.
)
echo.
echo Press any key to continue...
pause >nul
goto MENU

:REMOVE_TOKEN
echo.
set /p "token_name=Enter token filename (without .token extension): "
if defined token_name (
    set "full_token_path=%TOKEN_PATH%\%token_name%.token"
    if exist "%full_token_path%" (
        del "%full_token_path%"
        echo Token %token_name%.token removed successfully.
    ) else (
        echo Token %token_name%.token not found.
    )
) else (
    echo No token name provided.
)
echo.
echo Press any key to continue...
pause >nul
goto MENU

:REMOVE_ALL
echo.
echo WARNING: This will remove ALL tokens!
choice /m "Are you sure you want to continue"
if errorlevel 2 (
    echo Operation cancelled.
) else (
    if exist "%TOKEN_PATH%" (
        del "%TOKEN_PATH%\*.token" 2>nul
        echo All tokens removed successfully.
    ) else (
        echo Token directory does not exist.
    )
)
echo.
echo Press any key to continue...
pause >nul
goto MENU

:SHOW_STRUCTURE
echo.
echo DSS Directory Structure:
echo ----------------------
echo %DSS_PATH%
echo ├── 746f6b656e (token directory)
echo └── 6469726563746f7279 (user directory)
echo.
echo Press any key to continue...
pause >nul
goto MENU

:APPLY_PROTECTION
echo.
echo Applying runtime protection while servers are running...
call "%~dp0protect_dss_while_running.bat"
echo.
echo Press any key to continue...
pause >nul
goto MENU

:APPLY_ENHANCED_SECURITY
echo.
echo Applying enhanced security protections...
call "%~dp0enhanced_secure_dss.bat"
echo.
echo Press any key to continue...
pause >nul
goto MENU

:CREATE_DSS_STRUCTURE
:: Create the base DSS directory
if not exist "%DSS_PATH%" (
    mkdir "%DSS_PATH%"
    if !errorlevel! equ 0 (
        echo Successfully created DSS directory
    ) else (
        echo Failed to create DSS directory
        exit /b 1
    )
) else (
    echo DSS directory already exists
)

:: Create the token directory (hex: 'token' = 746f6b656e)
if not exist "%TOKEN_PATH%" (
    mkdir "%TOKEN_PATH%"
    if !errorlevel! equ 0 (
        echo Successfully created token directory
    ) else (
        echo Failed to create token directory
        exit /b 1
    )
) else (
    echo Token directory already exists
)

:: Create the user directory (hex: 'directory' = 6469726563746f7279)
if not exist "%USER_PATH%" (
    mkdir "%USER_PATH%"
    if !errorlevel! equ 0 (
        echo Successfully created user directory
    ) else (
        echo Failed to create user directory
        exit /b 1
    )
) else (
    echo User directory already exists
)
exit /b

:EXIT
echo.
echo Thank you for using DSS Token Manager!
echo.