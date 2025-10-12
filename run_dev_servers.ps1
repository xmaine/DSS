# Document Solutions Development Servers - PowerShell Version

Write-Host "========================================"
Write-Host "Document Solutions - Development Environment (PowerShell)"
Write-Host "========================================"
Write-Host ""

# Check if we're in the correct directory
Write-Host "[BACKEND CHECK] Checking for backend files..."
Write-Host "Current directory: $(Get-Location)"
Write-Host "Backend directory contents:"
Get-ChildItem -Path "backend" -Name
if (Test-Path "backend\manage.py") {
    Write-Host "[BACKEND SUCCESS] Found backend\manage.py" -ForegroundColor Green
} else {
    Write-Host "[BACKEND ERROR] Cannot find backend\manage.py" -ForegroundColor Red
    Write-Host "[BACKEND ERROR] Cannot find backend directory. Please run this script from the project root directory." -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)"
    Write-Host ""
    Write-Host "Troubleshooting:"
    Write-Host "1. Make sure you're in the project root directory (D:\PYTHON\Projects\Django\DSS)"
    Write-Host "2. Check that the backend directory exists with manage.py file"
    Write-Host ""
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "[FRONTEND CHECK] Checking for frontend files..."
Write-Host "Frontend directory contents:"
Get-ChildItem -Path "frontend" -Name
Write-Host "Checking specifically for frontend\package.json..."
if (Test-Path "frontend\package.json") {
    Write-Host "[FRONTEND SUCCESS] Found frontend\package.json" -ForegroundColor Green
} else {
    Write-Host "[FRONTEND ERROR] Cannot find frontend\package.json" -ForegroundColor Red
    Write-Host "[FRONTEND ERROR] Cannot find frontend directory. Please run this script from the project root directory." -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)"
    Write-Host ""
    Write-Host "Troubleshooting:"
    Write-Host "1. Make sure you're in the project root directory (D:\PYTHON\Projects\Django\DSS)"
    Write-Host "2. Check that the frontend directory exists with package.json file"
    Write-Host ""
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "[ALL CHECKS PASSED] Starting Document Solutions Development Servers..." -ForegroundColor Green
Write-Host ""

# Check if Python is available
Write-Host "[PYTHON CHECK] Checking if Python is available..."
try {
    $pythonVersion = & python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[PYTHON SUCCESS] Python is available" -ForegroundColor Green
        Write-Host $pythonVersion
    } else {
        Write-Host "ERROR: Python is not installed or not in PATH." -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:"
        Write-Host "1. Install Python from https://www.python.org/downloads/"
        Write-Host "2. Make sure Python is added to your system PATH"
        Write-Host "3. Restart your command prompt after installing Python"
        Write-Host ""
        Read-Host "Press Enter to continue"
        exit 1
    }
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:"
    Write-Host "1. Install Python from https://www.python.org/downloads/"
    Write-Host "2. Make sure Python is added to your system PATH"
    Write-Host "3. Restart your command prompt after installing Python"
    Write-Host ""
    Read-Host "Press Enter to continue"
    exit 1
}

# Check if Node.js is available
Write-Host "[NODE CHECK] Checking if Node.js is available..."
try {
    $nodeVersion = & node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[NODE SUCCESS] Node.js is available" -ForegroundColor Green
        Write-Host $nodeVersion
    } else {
        Write-Host "ERROR: Node.js is not installed or not in PATH." -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:"
        Write-Host "1. Install Node.js from https://nodejs.org/"
        Write-Host "2. Make sure Node.js is added to your system PATH"
        Write-Host "3. Restart your command prompt after installing Node.js"
        Write-Host ""
        Read-Host "Press Enter to continue"
        exit 1
    }
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:"
    Write-Host "1. Install Node.js from https://nodejs.org/"
    Write-Host "2. Make sure Node.js is added to your system PATH"
    Write-Host "3. Restart your command prompt after installing Node.js"
    Write-Host ""
    Read-Host "Press Enter to continue"
    exit 1
}

# Check if virtual environment exists
Write-Host "[VENV CHECK] Checking if virtual environment exists..."
if (-not (Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "WARNING: Virtual environment not found. Creating one..." -ForegroundColor Yellow
    try {
        & python -m venv venv
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Failed to create virtual environment." -ForegroundColor Red
            Write-Host ""
            Write-Host "Troubleshooting:"
            Write-Host "1. Make sure you have permission to create directories in this location"
            Write-Host "2. Check if Python venv module is available"
            Write-Host ""
            Read-Host "Press Enter to continue"
            exit 1
        }
        Write-Host "Virtual environment created successfully." -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "ERROR: Failed to create virtual environment." -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:"
        Write-Host "1. Make sure you have permission to create directories in this location"
        Write-Host "2. Check if Python venv module is available"
        Write-Host ""
        Read-Host "Press Enter to continue"
        exit 1
    }
} else {
    Write-Host "[VENV SUCCESS] Virtual environment found" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "[VENV ACTIVATE] Activating virtual environment..."
try {
    & venv\Scripts\Activate.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to activate virtual environment." -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:"
        Write-Host "1. Check if venv\Scripts\Activate.ps1 exists"
        Write-Host "2. Make sure you have permission to run scripts"
        Write-Host "3. You might need to run 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser'"
        Write-Host ""
        Read-Host "Press Enter to continue"
        exit 1
    }
    Write-Host "[VENV ACTIVATE SUCCESS] Virtual environment activated" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to activate virtual environment." -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:"
    Write-Host "1. Check if venv\Scripts\Activate.ps1 exists"
    Write-Host "2. Make sure you have permission to run scripts"
    Write-Host "3. You might need to run 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser'"
    Write-Host ""
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "All checks passed! You can now manually start the servers:" -ForegroundColor Green
Write-Host "1. Open a new terminal and run: cd backend && python manage.py runserver 8000"
Write-Host "2. Open another terminal and run: cd frontend && npm start"
Write-Host ""
Write-Host "Or run the batch file from Command Prompt instead of PowerShell."
Write-Host ""
Read-Host "Press Enter to exit"