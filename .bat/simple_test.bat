@echo off
echo Simple test script
echo Current directory: %CD%
echo Script location: %~dp0
echo.
echo Testing basic commands...
echo.
echo Testing ping command:
ping -n 2 127.0.0.1 >nul
echo Ping test completed
echo.
echo Testing netstat command:
netstat -an | findstr :8000
echo Netstat test completed
echo.
echo Testing Python:
python --version
echo.
echo Testing Node:
node --version
echo.
echo All tests completed
pause
