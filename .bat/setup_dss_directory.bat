@echo off
setlocal enabledelayedexpansion
:: DSS Directory Setup Script
:: Creates the required directory structure for machine tokens and user data
:: Path: C:\Users\Default\AppData\Local\DSS\

echo [DSS DIRECTORY SETUP]
echo Creating DSS directory structure...

:: Create the base DSS directory
set "DSS_PATH=%LOCALAPPDATA%\DSS"
echo Creating directory: %DSS_PATH%
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
set "TOKEN_PATH=%DSS_PATH%\746f6b656e"
echo Creating token directory: %TOKEN_PATH%
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
set "USER_PATH=%DSS_PATH%\6469726563746f7279"
echo Creating user directory: %USER_PATH%
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

echo.
echo [DIRECTORY STRUCTURE CREATED SUCCESSFULLY]
echo Base Path: %DSS_PATH%
echo Token Path: %TOKEN_PATH%
echo User Path: %USER_PATH%
echo.
echo Security Note: Directory names are hex-encoded for security
echo   - 'token' directory: 746f6b656e
echo   - 'directory' directory: 6469726563746f7279
echo.
echo Press any key to exit...
pause >nul