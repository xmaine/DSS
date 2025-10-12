# Document Solutions - Test Server Start (PowerShell)
Write-Host "========================================"
Write-Host "Document Solutions - Test Server Start"
Write-Host "========================================"
Write-Host ""

# Navigate to the project root directory (parent of .bat directory)
Set-Location -Path "$PSScriptRoot\.."

Write-Host "Testing server startup without user interaction..."
Write-Host ""

# Start backend server
Write-Host "Starting Django backend server..."
Start-Process cmd -ArgumentList "/k", "cd backend && title Django Backend Server && python manage.py runserver 8000" -WindowStyle Normal

# Wait a few seconds for backend to start
Start-Sleep -Seconds 5

# Check if backend server started successfully
$backendPort = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($backendPort) {
    Write-Host "[BACKEND SERVER SUCCESS] Backend server started successfully on http://127.0.0.1:8000" -ForegroundColor Green
} else {
    Write-Host "[BACKEND SERVER WARNING] Backend server may not have started correctly." -ForegroundColor Yellow
}

# Start frontend server
Write-Host "Starting React frontend server..."
Start-Process cmd -ArgumentList "/k", "cd frontend && title React Frontend Server && npm start" -WindowStyle Normal

# Wait for frontend server to start
Write-Host "[FRONTEND SERVER] Waiting for frontend server to initialize..."
Start-Sleep -Seconds 15

# Check if frontend server started successfully
$frontendPort = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($frontendPort) {
    Write-Host "[FRONTEND SERVER SUCCESS] Frontend server started successfully on http://127.0.0.1:3000/" -ForegroundColor Green
} else {
    Write-Host "[FRONTEND SERVER WARNING] Frontend server may not have started correctly." -ForegroundColor Yellow
}

# Open Chrome browser to the frontend URL
Write-Host "[BROWSER] Opening Chrome browser to http://127.0.0.1:3000/"
Start-Sleep -Seconds 3

# Try multiple methods to open Chrome
if (Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe") {
    Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "http://127.0.0.1:3000/"
} elseif (Test-Path "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe") {
    Start-Process "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -ArgumentList "http://127.0.0.1:3000/"
} else {
    # Fallback to just chrome.exe if in PATH
    Start-Process chrome.exe -ArgumentList "http://127.0.0.1:3000/"
}

Write-Host ""
Write-Host "========================================"
Write-Host "Test Complete"
Write-Host "========================================"
Write-Host "Servers should be running and Chrome should have opened"
Write-Host ""
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")