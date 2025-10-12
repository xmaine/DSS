# Document Solutions - Development Server Starter
# This script works with PowerShell execution policies

Write-Host "========================================"
Write-Host "Document Solutions - Development Servers"
Write-Host "========================================"
Write-Host ""

# Verify we're in the correct directory
$projectRoot = Get-Location
Write-Host "Project root: $projectRoot"

if (-not (Test-Path "backend\manage.py")) {
    Write-Host "ERROR: Cannot find backend\manage.py" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory:" -ForegroundColor Yellow
    Write-Host "D:\PYTHON\Projects\Django\DSS" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "frontend\package.json")) {
    Write-Host "ERROR: Cannot find frontend\package.json" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory:" -ForegroundColor Yellow
    Write-Host "D:\PYTHON\Projects\Django\DSS" -ForegroundColor Yellow
    exit 1
}

Write-Host "[SUCCESS] Project files verified!" -ForegroundColor Green
Write-Host ""

# Check if Python is available
try {
    $pythonVersion = & python --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Python found: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Python not found in PATH" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR: Python not found in PATH" -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
try {
    $nodeVersion = & node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Node.js not found in PATH" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR: Node.js not found in PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting development servers..." -ForegroundColor Cyan
Write-Host ""

# Start backend server (Django on port 8000)
Write-Host "1. Starting Django backend server..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k cd backend && python manage.py runserver 8000" -WorkingDirectory $projectRoot

# Wait a moment for the first process to start
Start-Sleep -Milliseconds 500

# Start frontend server (React on port 3000)
Write-Host "2. Starting React frontend server..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k cd frontend && npm start" -WorkingDirectory $projectRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "DEVELOPMENT SERVERS STARTED SUCCESSFULLY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "NOTES:" -ForegroundColor Cyan
Write-Host "- Two new Command Prompt windows have been opened" -ForegroundColor Cyan
Write-Host "- Close those windows to stop the respective servers" -ForegroundColor Cyan
Write-Host "- This PowerShell window can now be closed" -ForegroundColor Cyan
Write-Host ""