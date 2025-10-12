# Backend Server Starter Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory and navigate to project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Current directory: $PWD" -ForegroundColor Yellow

# Check if backend directory exists
if (-not (Test-Path "backend\manage.py")) {
    Write-Host "ERROR: Backend directory not found!" -ForegroundColor Red
    Write-Host "Current directory contents:" -ForegroundColor Red
    Get-ChildItem | Select-Object Name
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Backend directory found" -ForegroundColor Green

# Kill existing processes on port 8000
Write-Host "Closing existing backend processes..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($processes) {
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        Write-Host "Killing process $pid on port 8000" -ForegroundColor Red
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
}

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Activate virtual environment if it exists
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
}

# Start Django server
Write-Host "Starting Django backend server..." -ForegroundColor Yellow
Write-Host "Backend will be available at: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host ""

# Start the server in a new window
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$PWD\backend`" && python manage.py runserver 8000" -WindowStyle Normal

Write-Host "Backend server started in a new window." -ForegroundColor Green
Write-Host "Keep that window open for the server to run." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close this window"
