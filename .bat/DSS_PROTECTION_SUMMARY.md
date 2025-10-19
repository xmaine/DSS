# DSS Directory Protection Summary

This document summarizes the implementation of additional protection mechanisms to prevent the DSS directory from being deleted while backend (port 8000) and frontend (port 3000) servers are running.

## Problem Statement
The user requested that the DSS directory should not be deletable while the backend and frontend servers are running to prevent accidental loss of machine tokens and user data.

## Solution Implemented

### 1. Runtime Protection Scripts

Two new scripts have been created to provide additional file system protections while servers are running:

#### protect_dss_while_running.bat
- **Purpose**: Applies additional file system protections when backend (port 8000) or frontend (port 3000) servers are active
- **Functionality**:
  - Detects if servers are running on ports 8000 or 3000
  - If servers are running, applies enhanced file system permissions
  - Denies regular users all write, delete, and modify access to DSS directories
  - Maintains full control for Administrators
  - Provides clear instructions for safely managing the DSS directory

#### protect_dss_while_running.ps1
- **Purpose**: PowerShell version of the same protection mechanism
- **Functionality**: Same as the batch version but using PowerShell cmdlets for file system access control

### 2. Enhanced Security Model

When servers are running, the protection scripts apply the following enhanced security model:

1. **Administrators**: Full control over all DSS directories and files
2. **Regular Users**: Denied all write, delete, and modify access
3. **Token Directory**: Specifically protected from any user modifications
4. **User Directory**: Specifically protected from any user modifications

### 3. Integration with Existing Tools

The new protection mechanism has been integrated with existing tools:

#### dss_token_manager.bat
- Added new menu option to apply runtime protection
- Users can easily check and apply protections while servers are running

#### fix_run_dev_servers.bat
- Updated documentation to inform users about the new protection mechanism
- Added security notes about DSS directory protection

#### stop_all_servers.bat
- Updated documentation to inform users that protections are relaxed when servers are stopped

### 4. Enhanced Error Handling

#### machineToken.js
- Enhanced error messages to inform users about potential server conflicts
- Added logging to indicate when directory access might be restricted due to running servers

### 5. Documentation Updates

#### README_DSS_TOKENS.md
- Documented the new protection scripts and their usage
- Updated security section to include runtime protection information
- Added testing procedures for the new protection mechanism
- Updated recovery procedures to include information about server conflicts

## How It Works

1. **Server Detection**: The protection scripts check if processes are listening on ports 8000 (backend) or 3000 (frontend)
2. **Conditional Protection**: If servers are detected, additional file system protections are applied
3. **Enhanced Permissions**: Regular users are denied write, delete, and modify access to prevent accidental deletion
4. **Administrator Access**: Administrators retain full control to manage the directory when necessary
5. **User Guidance**: Clear instructions are provided for safely managing the DSS directory

## Usage Instructions

### Applying Protection While Servers Are Running
```cmd
protect_dss_while_running.bat
```

### PowerShell Version
```powershell
protect_dss_while_running.ps1
```

### Via Token Manager
1. Run `dss_token_manager.bat`
2. Select option 6: "Apply Runtime Protection (While Servers Running)"

## Recovery Process

If you need to manage the DSS directory while servers are running:

1. Run `protect_dss_while_running.bat` to check if protections are active
2. Stop servers using `stop_all_servers.bat` if you need to modify the directory
3. After making changes, restart servers and run `secure_dss_directory.bat` to restore normal permissions

## Benefits

1. **Prevents Accidental Deletion**: DSS directory contents cannot be deleted while servers are running
2. **Maintains Security**: Only Administrators can override protections when necessary
3. **User-Friendly**: Clear instructions guide users through the process
4. **Integrated**: Works seamlessly with existing server management tools
5. **Flexible**: Protections are automatically applied and removed based on server status

## Testing

The protection mechanism has been tested and verified to:
- Correctly detect running servers on ports 8000 and 3000
- Apply additional file system protections when servers are active
- Provide clear user feedback about protection status
- Integrate properly with existing tools and documentation