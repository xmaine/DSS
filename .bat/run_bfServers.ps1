# Run Backend & Frontend Servers (PowerShell)
# - Stops any existing servers on ports 8000 and 3000
# - Starts Django backend in a new window
# - Starts React frontend in a new window
# - Opens Chrome to http://127.0.0.1:3000/

param(
    [int]$BackendPort = 8000,
    [int]$FrontendPort = 3000
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Run Backend & Frontend Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project root (parent of .bat)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

Write-Host "Project root: $PWD" -ForegroundColor Yellow

# Validate structure
if (-not (Test-Path "backend/manage.py")) {
    Write-Host "ERROR: backend/manage.py not found" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "frontend/package.json")) {
    Write-Host "ERROR: frontend/package.json not found" -ForegroundColor Red
    exit 1
}

# Kill processes on specified ports
function Stop-PortProcess {
    param([int]$Port)
    try {
        $conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($conns) {
            $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($pid in $pids) {
                Write-Host "Killing PID $pid on port $Port" -ForegroundColor Red
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {}
}

Write-Host "Stopping any existing servers..." -ForegroundColor Yellow
Stop-PortProcess -Port $BackendPort
Stop-PortProcess -Port $FrontendPort
Start-Sleep -Seconds 2

# Python check
try { $py = (python --version) 2>&1; Write-Host "Python: $py" -ForegroundColor Green } catch { Write-Host "ERROR: Python not found" -ForegroundColor Red; exit 1 }
# Node check
try { $nd = (node --version) 2>&1; Write-Host "Node: $nd" -ForegroundColor Green } catch { Write-Host "ERROR: Node.js not found" -ForegroundColor Red; exit 1 }

# Ensure venv is activated if present
if (Test-Path "venv/Scripts/Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    . "venv/Scripts/Activate.ps1"
}

# Ensure frontend deps
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm install failed" -ForegroundColor Red; Pop-Location; exit 1 }
    Pop-Location
}

# Start backend
Write-Host "Starting Django backend on port $BackendPort..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$projectRoot\backend`" && title Django Backend Server && python manage.py runserver $BackendPort" -WindowStyle Normal

# Small delay
Start-Sleep -Seconds 5

# Start frontend
Write-Host "Starting React frontend on port $FrontendPort..." -ForegroundColor Yellow
$env:BROWSER = "none"
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$projectRoot\frontend`" && title React Frontend Server && set BROWSER=none && npm start" -WindowStyle Normal

# Wait for frontend
Start-Sleep -Seconds 8

# Open Chrome
function Open-Chrome {
    param([string]$Url)
    $candidates = @(
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) { Start-Process -FilePath $c -ArgumentList "--new-window", $Url; return }
    }
    try { Start-Process "chrome" $Url } catch { Write-Host "Open this URL manually: $Url" -ForegroundColor Yellow }
}

Open-Chrome -Url "http://127.0.0.1:$FrontendPort/"

Write-Host ""
Write-Host "Backend:  http://127.0.0.1:$BackendPort" -ForegroundColor Green
Write-Host "Frontend: http://127.0.0.1:$FrontendPort" -ForegroundColor Green
Write-Host "Servers started in two new windows. Keep them open." -ForegroundColor Cyan
