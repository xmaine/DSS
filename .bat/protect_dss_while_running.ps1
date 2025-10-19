# DSS Running Process Protection Script (PowerShell Version)
# Applies additional file system protections to the DSS directory
# while backend (port 8000) and frontend (port 3000) servers are running
#
# This script should be run before attempting to delete the DSS directory
# to prevent accidental deletion while servers are active

Write-Host "=================================================="
Write-Host "       DSS DIRECTORY PROTECTION (PowerShell)"
Write-Host "=================================================="
Write-Host "Checking if DSS servers are running..."
Write-Host ""

# Define the DSS path
$DSS_PATH = "$env:LOCALAPPDATA\DSS"

# Check if DSS directory exists
if (-not (Test-Path $DSS_PATH)) {
    Write-Host "INFO: DSS directory does not exist at $DSS_PATH"
    Write-Host "No protection needed."
    Write-Host ""
    exit 0
}

Write-Host "DSS directory found at: $DSS_PATH"
Write-Host ""

# Check if backend server (port 8000) is running
Write-Host "Checking for backend server on port 8000..."
$backendRunning = $false
try {
    $netstatOutput = netstat -an | Select-String ":8000 " | Select-String "LISTENING"
    if ($netstatOutput) {
        Write-Host "[ACTIVE] Backend server is running on port 8000"
        $backendRunning = $true
    } else {
        Write-Host "[INACTIVE] Backend server is not running on port 8000"
    }
} catch {
    Write-Host "[ERROR] Failed to check backend server status"
}

# Check if frontend server (port 3000) is running
Write-Host "Checking for frontend server on port 3000..."
$frontendRunning = $false
try {
    $netstatOutput = netstat -an | Select-String ":3000 " | Select-String "LISTENING"
    if ($netstatOutput) {
        Write-Host "[ACTIVE] Frontend server is running on port 3000"
        $frontendRunning = $true
    } else {
        Write-Host "[INACTIVE] Frontend server is not running on port 3000"
    }
} catch {
    Write-Host "[ERROR] Failed to check frontend server status"
}

# If either server is running, apply additional protections
if ($backendRunning -or $frontendRunning) {
    Write-Host ""
    Write-Host "Applying additional protection while servers are running..."
    Apply-Protection
    exit 1
}

Write-Host ""
Write-Host "No servers are currently running. DSS directory can be safely managed."
Write-Host ""
exit 0

function Apply-Protection {
    # Apply additional file system protections when servers are running
    Write-Host ""
    Write-Host "Applying additional file system protections to prevent deletion..."
    Write-Host ""
    
    try {
        # Get current ACL for the base DSS directory
        $acl = Get-Acl $DSS_PATH
        
        # Create access rules
        # Administrators - Full Control
        $adminRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrators", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
        $acl.SetAccessRule($adminRule)
        
        # Users - Deny all modifications (write, delete, modify)
        $denyRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "Delete,DeleteSubdirectoriesAndFiles,Write,Modify", "ContainerInherit,ObjectInherit", "None", "Deny")
        $acl.AddAccessRule($denyRule)
        
        # Apply the ACL
        Set-Acl $DSS_PATH $acl
        Write-Host "- Granted Administrators full control on base directory"
        Write-Host "- Denied Users write, delete, and modify access to all directories"
        
        # Specifically protect the token directory from any user modifications
        $TOKEN_PATH = "$DSS_PATH\746f6b656e"
        if (Test-Path $TOKEN_PATH) {
            $tokenAcl = Get-Acl $TOKEN_PATH
            $denyRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "Delete,DeleteSubdirectoriesAndFiles,Write,Modify", "ContainerInherit,ObjectInherit", "None", "Deny")
            $tokenAcl.AddAccessRule($denyRule)
            Set-Acl $TOKEN_PATH $tokenAcl
            Write-Host "- Additional protection applied to token directory"
        }
        
        # Specifically protect the user directory from any user modifications
        $USER_PATH = "$DSS_PATH\6469726563746f7279"
        if (Test-Path $USER_PATH) {
            $userDirAcl = Get-Acl $USER_PATH
            $denyRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "Delete,DeleteSubdirectoriesAndFiles,Write,Modify", "ContainerInherit,ObjectInherit", "None", "Deny")
            $userDirAcl.AddAccessRule($denyRule)
            Set-Acl $USER_PATH $userDirAcl
            Write-Host "- Additional protection applied to user directory"
        }
        
        Write-Host ""
        Write-Host "=================================================="
        Write-Host "DSS DIRECTORY PROTECTION APPLIED"
        Write-Host "=================================================="
        Write-Host "Additional protections implemented while servers are running:"
        Write-Host "1. Administrators have full control"
        Write-Host "2. Regular users have NO write/delete/modify access"
        Write-Host "3. Token directory is protected from all user modifications"
        Write-Host "4. User directory is protected from all user modifications"
        Write-Host ""
        Write-Host "To safely manage the DSS directory:"
        Write-Host "1. Stop all servers using stop_all_servers.bat"
        Write-Host "2. Then manage the directory as needed"
        Write-Host "3. Run secure_dss_directory.ps1 to restore normal permissions"
        Write-Host ""
        Write-Host "Press any key to exit..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 0
    }
    catch {
        Write-Host "ERROR: Failed to apply additional security permissions"
        Write-Host "Details: $($_.Exception.Message)"
        Write-Host ""
        Write-Host "Press any key to exit..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}