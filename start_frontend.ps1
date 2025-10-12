# Frontend Server Starter Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Frontend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory and navigate to project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Current directory: $PWD" -ForegroundColor Yellow

# Check if frontend directory exists
if (-not (Test-Path "frontend\package.json")) {
    Write-Host "ERROR: Frontend directory not found!" -ForegroundColor Red
    Write-Host "Current directory contents:" -ForegroundColor Red
    Get-ChildItem | Select-Object Name
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Frontend directory found" -ForegroundColor Green

# Kill existing processes on port 3000
Write-Host "Closing existing frontend processes..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($processes) {
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        Write-Host "Killing process $pid on port 3000" -ForegroundColor Red
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
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

# Check if node_modules exist
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Set-Location ".."
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
}

# Start React server
Write-Host "Starting React frontend server..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://127.0.0.1:3000" -ForegroundColor Green
Write-Host ""

# Set environment variable to prevent auto-opening browser
$env:BROWSER = "none"

# Start the server in a new window
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$PWD\frontend`" && set BROWSER=none && npm start" -WindowStyle Normal

# Wait a moment for server to start
Start-Sleep -Seconds 3

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
Write-Host "Frontend server started in a new window." -ForegroundColor Green
Write-Host "Keep that window open for the server to run." -ForegroundColor Yellow
Write-Host "Chrome should have opened to http://127.0.0.1:3000" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close this window"
