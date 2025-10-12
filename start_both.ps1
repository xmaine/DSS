# Start Both Backend and Frontend Servers
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Both Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory and navigate to project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Current directory: $PWD" -ForegroundColor Yellow

# Check if both directories exist
if (-not (Test-Path "backend\manage.py")) {
    Write-Host "ERROR: Backend directory not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path "frontend\package.json")) {
    Write-Host "ERROR: Frontend directory not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Both directories found" -ForegroundColor Green

# Kill existing processes
Write-Host "Closing existing servers..." -ForegroundColor Yellow

# Kill backend processes
$backendProcesses = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($backendProcesses) {
    foreach ($process in $backendProcesses) {
        $pid = $process.OwningProcess
        Write-Host "Killing backend process $pid on port 8000" -ForegroundColor Red
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
}

# Kill frontend processes
$frontendProcesses = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($frontendProcesses) {
    foreach ($process in $frontendProcesses) {
        $pid = $process.OwningProcess
        Write-Host "Killing frontend process $pid on port 3000" -ForegroundColor Red
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
}

# Wait for processes to close
Start-Sleep -Seconds 2

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Activate virtual environment if it exists
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
}

# Check if frontend dependencies are installed
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install frontend dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Set-Location ".."
    Write-Host "Frontend dependencies installed successfully" -ForegroundColor Green
}

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$PWD\backend`" && python manage.py runserver 8000" -WindowStyle Normal

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
$env:BROWSER = "none"
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$PWD\frontend`" && set BROWSER=none && npm start" -WindowStyle Normal

# Wait for frontend to start
Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Try to open Chrome
Write-Host "Opening Chrome browser..." -ForegroundColor Yellow

$chromePaths = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

$chromeOpened = $false
foreach ($chromePath in $chromePaths) {
    if (Test-Path $chromePath) {
        Write-Host "Opening Chrome from: $chromePath" -ForegroundColor Green
        Start-Process -FilePath $chromePath -ArgumentList "--new-window", "http://127.0.0.1:3000/"
        $chromeOpened = $true
        break
    }
}

if (-not $chromeOpened) {
    Write-Host "Chrome not found in standard locations. Trying chrome command..." -ForegroundColor Yellow
    try {
        Start-Process "chrome" "http://127.0.0.1:3000/"
        $chromeOpened = $true
    } catch {
        Write-Host "Could not open Chrome automatically." -ForegroundColor Red
        Write-Host "Please manually open: http://127.0.0.1:3000/" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Both Servers Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor White
Write-Host "Frontend: http://127.0.0.1:3000" -ForegroundColor White
Write-Host ""
Write-Host "Two new windows opened:" -ForegroundColor White
Write-Host "- Django Backend Server (keep open)" -ForegroundColor White
Write-Host "- React Frontend Server (keep open)" -ForegroundColor White
Write-Host ""
Write-Host "Chrome should have opened to the frontend." -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close this window"
