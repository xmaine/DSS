# DSS Folder Backup and Restore Script (PowerShell Version)
# Automates backup and restoration of folder structure

Write-Host "=================================================="
Write-Host "       DSS FOLDER BACKUP AND RESTORE (PowerShell)"
Write-Host "=================================================="
Write-Host ""

# Navigate to the backend directory
Set-Location -Path "$PSScriptRoot\..\backend"

Write-Host "Current directory: $(Get-Location)"
Write-Host ""

# Check if manage.py exists
if (-not (Test-Path "manage.py")) {
    Write-Host "ERROR: manage.py not found!" -ForegroundColor Red
    Write-Host "Please run this script from the correct directory."
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Function to backup folder structure
function Backup-Folders {
    Write-Host ""
    Write-Host "=== BACKUP FOLDER STRUCTURE ===" -ForegroundColor Green
    Write-Host ""
    
    # Get backup filename
    $backupName = Read-Host "Enter backup filename (without extension, default: folder_backup)"
    if (-not $backupName) { $backupName = "folder_backup" }
    
    # Add timestamp to filename
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $fullBackupName = "${backupName}_${timestamp}.json"
    
    Write-Host ""
    Write-Host "Creating backup: $fullBackupName"
    Write-Host ""
    
    python manage.py backup_folders --output "$fullBackupName"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==================================================" -ForegroundColor Green
        Write-Host "Backup completed successfully!" -ForegroundColor Green
        Write-Host "Backup file: $fullBackupName" -ForegroundColor Green
        Write-Host "==================================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "==================================================" -ForegroundColor Red
        Write-Host "Backup failed!" -ForegroundColor Red
        Write-Host "==================================================" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Show-Menu
}

# Function to restore folder structure
function Restore-Folders {
    Write-Host ""
    Write-Host "=== RESTORE FOLDER STRUCTURE ===" -ForegroundColor Green
    Write-Host ""
    
    # List available backup files
    Write-Host "Available backup files:"
    $backupFiles = Get-ChildItem -Path "." -Filter "*.json" | Where-Object { $_.Name -like "*backup*" }
    
    if ($backupFiles) {
        $backupFiles | ForEach-Object { Write-Host "  $($_.Name)" }
    } else {
        Write-Host "  No backup files found in current directory."
    }
    
    Write-Host ""
    $restoreFile = Read-Host "Enter backup filename to restore"
    if (-not $restoreFile) {
        Write-Host "No filename entered."
        Write-Host ""
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Show-Menu
        return
    }
    
    # Check if file exists
    if (-not (Test-Path $restoreFile)) {
        Write-Host "ERROR: File $restoreFile not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Show-Menu
        return
    }
    
    Write-Host ""
    Write-Host "Restoring from: $restoreFile"
    Write-Host ""
    
    # Ask for force option
    $forceChoice = Read-Host "Force restoration? This will overwrite existing folders. (y/N)"
    if ($forceChoice -eq "y" -or $forceChoice -eq "Y") {
        Write-Host "Performing force restoration..."
        python manage.py restore_folders "$restoreFile" --force
    } else {
        Write-Host "Performing normal restoration..."
        python manage.py restore_folders "$restoreFile"
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==================================================" -ForegroundColor Green
        Write-Host "Restoration completed successfully!" -ForegroundColor Green
        Write-Host "==================================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "==================================================" -ForegroundColor Red
        Write-Host "Restoration failed!" -ForegroundColor Red
        Write-Host "==================================================" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Show-Menu
}

# Function to show menu
function Show-Menu {
    Clear-Host
    Write-Host "=================================================="
    Write-Host "       DSS FOLDER BACKUP AND RESTORE (PowerShell)"
    Write-Host "=================================================="
    Write-Host ""
    Write-Host "Select an option:"
    Write-Host "1. Backup folder structure"
    Write-Host "2. Restore folder structure"
    Write-Host "3. Exit"
    Write-Host ""
    
    $choice = Read-Host "Select an option (1-3)"
    
    switch ($choice) {
        "1" { Backup-Folders }
        "2" { Restore-Folders }
        "3" { 
            Write-Host ""
            Write-Host "Thank you for using DSS Folder Backup and Restore!"
            Write-Host ""
            exit 0
        }
        default { 
            Write-Host "Invalid option. Please select 1, 2, or 3."
            Write-Host ""
            Write-Host "Press any key to continue..."
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            Show-Menu
        }
    }
}

# Start the menu
Show-Menu