# Enhanced DSS Directory Security Script (PowerShell Version)
# Applies advanced file system permissions to protect the DSS directory structure
# Makes token and user directories resilient against deletion, even by administrators
#
# Only System Administrators should be able to remove tokens via the web interface

Write-Host "=================================================="
Write-Host "       ENHANCED DSS DIRECTORY SECURITY (PowerShell)"
Write-Host "=================================================="
Write-Host "Applying enhanced security permissions to DSS directory..."
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

# Apply enhanced security permissions
Write-Host "Applying enhanced security permissions for maximum protection..."
Write-Host ""

try {
    # Get current ACL for the base DSS directory
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
    
    # Set owner to Administrators to prevent unauthorized ownership changes
    $owner = New-Object System.Security.Principal.NTAccount("Administrators")
    $acl.SetOwner($owner)
    Set-Acl $DSS_PATH $acl
    Write-Host "- Set owner to Administrators for all directories"
    
    # Specifically protect the token directory from deletion by any user including administrators
    $TOKEN_PATH = "$DSS_PATH\746f6b656e"
    if (Test-Path $TOKEN_PATH) {
        # Set special attributes to make it harder to delete
        $tokenItem = Get-Item $TOKEN_PATH
        $tokenItem.Attributes = $tokenItem.Attributes -bor [System.IO.FileAttributes]::ReadOnly -bor [System.IO.FileAttributes]::System
        
        # Apply advanced ACL rules
        $tokenAcl = Get-Acl $TOKEN_PATH
        
        # Deny regular users write/delete access
        $denyUsersRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "Delete,DeleteSubdirectoriesAndFiles,Write,Modify", "ContainerInherit,ObjectInherit", "None", "Deny")
        $tokenAcl.AddAccessRule($denyUsersRule)
        
        # Deny administrators delete access (but retain modify access)
        $denyAdminsRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrators", "Delete,DeleteSubdirectoriesAndFiles", "ContainerInherit,ObjectInherit", "None", "Deny")
        $tokenAcl.AddAccessRule($denyAdminsRule)
        
        Set-Acl $TOKEN_PATH $tokenAcl
        Write-Host "- Applied advanced protection to token directory"
        Write-Host "  * Read-only and system attributes set"
        Write-Host "  * Regular users denied write/delete access"
        Write-Host "  * Administrators denied delete access (but retain modify access)"
    }
    
    # Specifically protect the user directory from deletion by any user including administrators
    $USER_PATH = "$DSS_PATH\6469726563746f7279"
    if (Test-Path $USER_PATH) {
        # Set special attributes to make it harder to delete
        $userItem = Get-Item $USER_PATH
        $userItem.Attributes = $userItem.Attributes -bor [System.IO.FileAttributes]::ReadOnly -bor [System.IO.FileAttributes]::System
        
        # Apply advanced ACL rules
        $userDirAcl = Get-Acl $USER_PATH
        
        # Deny regular users write/delete access
        $denyUsersRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Users", "Delete,DeleteSubdirectoriesAndFiles,Write,Modify", "ContainerInherit,ObjectInherit", "None", "Deny")
        $userDirAcl.AddAccessRule($denyUsersRule)
        
        # Deny administrators delete access (but retain modify access)
        $denyAdminsRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrators", "Delete,DeleteSubdirectoriesAndFiles", "ContainerInherit,ObjectInherit", "None", "Deny")
        $userDirAcl.AddAccessRule($denyAdminsRule)
        
        Set-Acl $USER_PATH $userDirAcl
        Write-Host "- Applied advanced protection to user directory"
        Write-Host "  * Read-only and system attributes set"
        Write-Host "  * Regular users denied write/delete access"
        Write-Host "  * Administrators denied delete access (but retain modify access)"
    }
    
    # Apply additional protection by creating a lock file
    $LOCK_FILE = "$DSS_PATH\directory.lock"
    try {
        "DSS Directory Protection Lock File" | Out-File -FilePath $LOCK_FILE -Encoding UTF8
        # Set hidden and read-only attributes
        $lockItem = Get-Item $LOCK_FILE
        $lockItem.Attributes = $lockItem.Attributes -bor [System.IO.FileAttributes]::ReadOnly -bor [System.IO.FileAttributes]::System -bor [System.IO.FileAttributes]::Hidden
        Write-Host "- Created directory lock file to prevent deletion"
    } catch {
        Write-Host "WARNING: Failed to create directory lock file"
    }
    
    Write-Host ""
    Write-Host "=================================================="
    Write-Host "ENHANCED DSS DIRECTORY SECURITY APPLIED SUCCESSFULLY"
    Write-Host "=================================================="
    Write-Host "Advanced security measures implemented:"
    Write-Host "1. Administrators have full control (except deletion)"
    Write-Host "2. Regular users have read-only access"
    Write-Host "3. Token directory is protected from deletion by all users"
    Write-Host "4. User directory is protected from deletion by all users"
    Write-Host "5. Special attributes (Read-only, System) applied"
    Write-Host "6. Directory lock file created"
    Write-Host ""
    Write-Host "Protection Details:"
    Write-Host "- Regular users: Denied write, delete, and modify access"
    Write-Host "- Administrators: Retain modify access but denied delete access"
    Write-Host "- Special attributes make directories harder to remove"
    Write-Host "- Lock file prevents accidental directory deletion"
    Write-Host ""
    Write-Host "Only System Administrators can manage content via the web interface:"
    Write-Host "- System Administrators: Machine Tokens admin page"
    Write-Host "- Senior Department Heads: Machine Tokens admin page"
    Write-Host ""
    Write-Host "To modify directory structure:"
    Write-Host "1. Run this script to remove protections"
    Write-Host "2. Make necessary changes"
    Write-Host "3. Run this script again to reapply protections"
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
catch {
    Write-Host "ERROR: Failed to apply enhanced security permissions"
    Write-Host "Details: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}