# Simple Server Starter Script for PowerShell

# Function to check if a command exists
function Test-CommandExists {
    param ([string]$command)
    try {
        $exists = Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

Write-Host "========================================"
Write-Host "Document Solutions - Server Starter"
Write-Host "========================================"
Write-Host ""

# Check current directory
$projectRoot = Get-Location
Write-Host "Current directory: $projectRoot"
Write-Host ""

# Verify we're in the right place
if (-not (Test-Path "backend\manage.py")) {
    Write-Host "ERROR: Cannot find backend\manage.py" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    Write-Host "Current directory should be: D:\PYTHON\Projects\Django\DSS" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "frontend\package.json")) {
    Write-Host "ERROR: Cannot find frontend\package.json" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    Write-Host "Current directory should be: D:\PYTHON\Projects\Django\DSS" -ForegroundColor Yellow
    exit 1
}

Write-Host "[SUCCESS] Project files found!" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "[CHECK] Verifying prerequisites..." -ForegroundColor Cyan

# Check Python
if (-not (Test-CommandExists "python")) {
    Write-Host "ERROR: Python not found in PATH" -ForegroundColor Red
    Write-Host "Please install Python and add it to your PATH" -ForegroundColor Yellow
    exit 1
} else {
    $pythonVer = python --version
    Write-Host "  [OK] Python: $pythonVer" -ForegroundColor Green
}

# Check Node.js
if (-not (Test-CommandExists "node")) {
    Write-Host "ERROR: Node.js not found in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js and add it to your PATH" -ForegroundColor Yellow
    exit 1
} else {
    $nodeVer = node --version
    Write-Host "  [OK] Node.js: $nodeVer" -ForegroundColor Green
}

Write-Host ""
Write-Host "[READY] Starting servers..." -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "Starting Django backend server on port 8000..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd backend && python manage.py runserver 8000" -WorkingDirectory $projectRoot

# Wait a moment
Start-Sleep -Seconds 2

# Start frontend server
Write-Host "Starting React frontend server on port 3000..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd frontend && npm start" -WorkingDirectory $projectRoot

Write-Host ""
Write-Host "Servers started successfully!" -ForegroundColor Green
Write-Host "Backend:  http://127.0.0.1:8000"
Write-Host "Frontend: http://localhost:3000"
Write-Host ""
Write-Host "Close the individual server console windows to stop each server." -ForegroundColor Yellow
Write-Host ""