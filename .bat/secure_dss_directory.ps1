# DSS Directory Security Script (PowerShell Version)
# Applies file system permissions to protect the DSS directory structure
# Prevents unauthorized deletion of DSS directory contents
#
# Only System Administrators should be able to remove tokens via the web interface

Write-Host "=================================================="
Write-Host "       DSS DIRECTORY SECURITY (PowerShell)"
Write-Host "=================================================="
Write-Host "Applying security permissions to DSS directory..."
Write-Host ""

# Define the DSS path
$DSS_PATH = "$env:LOCALAPPDATA\DSS"

# Check if DSS directory exists
if (-not (Test-Path $DSS_PATH)) {
    Write-Host "ERROR: DSS directory does not exist at $DSS_PATH"
    Write-Host "Please run setup_dss_directory.bat first"
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "DSS directory found at: $DSS_PATH"
Write-Host ""

# Apply security permissions
Write-Host "Applying read-only permissions for regular users..."
Write-Host ""

try {
    # Get current ACL
    $acl = Get-Acl $DSS_PATH
    
    # Create access rules
    # Administrators - Full Control
    $adminRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrators", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.SetAccessRule($adminRule)
    
    # Users - Read Only
    $userRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "ReadAndExecute", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.SetAccessRule($userRule)
    
    # Apply the ACL
    Set-Acl $DSS_PATH $acl
    Write-Host "- Granted Administrators full control on base directory"
    Write-Host "- Granted Users read-only access to all directories"
    
    # Specifically protect the token directory from deletion by regular users
    $TOKEN_PATH = "$DSS_PATH\746f6b656e"
    if (Test-Path $TOKEN_PATH) {
        $tokenAcl = Get-Acl $TOKEN_PATH
        $denyRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "Delete,DeleteSubdirectoriesAndFiles,Write,Modify", "ContainerInherit,ObjectInherit", "None", "Deny")
        $tokenAcl.AddAccessRule($denyRule)
        Set-Acl $TOKEN_PATH $tokenAcl
        Write-Host "- Protected token directory from user modifications"
    }
    
    # Specifically protect the user directory from deletion by regular users
    $USER_PATH = "$DSS_PATH\6469726563746f7279"
    if (Test-Path $USER_PATH) {
        $userDirAcl = Get-Acl $USER_PATH
        $denyRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "Delete,DeleteSubdirectoriesAndFiles,Write,Modify", "ContainerInherit,ObjectInherit", "None", "Deny")
        $userDirAcl.AddAccessRule($denyRule)
        Set-Acl $USER_PATH $userDirAcl
        Write-Host "- Protected user directory from user modifications"
    }
    
    Write-Host ""
    Write-Host "=================================================="
    Write-Host "DSS DIRECTORY SECURITY APPLIED SUCCESSFULLY"
    Write-Host "=================================================="
    Write-Host "Security measures implemented:"
    Write-Host "1. Administrators have full control"
    Write-Host "2. Regular users have read-only access"
    Write-Host "3. Token directory is protected from user modifications"
    Write-Host "4. User directory is protected from user modifications"
    Write-Host ""
    Write-Host "Only System Administrators can:"
    Write-Host "- Delete files from the DSS directory"
    Write-Host "- Modify token files"
    Write-Host "- Remove user directories"
    Write-Host ""
    Write-Host "Regular users can only:"
    Write-Host "- Read files (for validation purposes)"
    Write-Host ""
    Write-Host "For token removal, users must use the web interface:"
    Write-Host "- System Administrators: Machine Tokens admin page"
    Write-Host "- Senior Department Heads: Machine Tokens admin page"
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
catch {
    Write-Host "ERROR: Failed to apply security permissions"
    Write-Host "Details: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}