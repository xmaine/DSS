# DSS Token Management System

This directory contains scripts for managing the Document Solutions System (DSS) machine token system.

## Directory Structure

The DSS system creates the following directory structure in `C:\Users\Default\AppData\Local\DSS\`:

```
C:\Users\Default\AppData\Local\DSS\
├── 746f6b656e\          (token directory - hex for 'token')
│   ├── {machine_id}.token  (machine token files)
└── 6469726563746f7279\  (user directory - hex for 'directory')
    ├── {username_hex}\     (user-specific directories with hex-encoded names)
```

## Security Features

1. **Hexadecimal Encoding**: Directory names are encoded in hexadecimal to obscure their purpose
   - 'token' → '746f6b656e'
   - 'directory' → '6469726563746f7279'

2. **Machine Identification**: Each token is bound to a specific machine ID

3. **User Binding**: Tokens are associated with specific user accounts

4. **Expiration**: Tokens automatically expire after 30 days

5. **File System Protection**: Directories are protected from unauthorized deletion

## Available Scripts

### 1. setup_dss_directory.bat
Creates the required directory structure for the DSS system using basic Windows commands.

**Usage:**
```cmd
setup_dss_directory.bat
```

### 2. setup_dss_real.bat
Advanced setup script that uses Node.js when available, with fallback to Windows commands.

**Usage:**
```cmd
setup_dss_real.bat
```

### 3. run_dss_test.bat
Runs the Node.js test script to create the directory structure and a test token.

**Usage:**
```cmd
run_dss_test.bat
```

### 4. dss_token_manager.bat
Comprehensive token management tool with the following features:
- Setup DSS directory structure
- List active tokens
- Remove specific tokens
- Remove all tokens (admin function)
- Show directory structure

**Usage:**
```cmd
dss_token_manager.bat
```

### 5. secure_dss_directory.bat / secure_dss_directory.ps1
Applies file system permissions to protect the DSS directory structure from unauthorized deletion.

**Usage (Command Prompt):**
```cmd
secure_dss_directory.bat
```

**Usage (PowerShell):**
```powershell
secure_dss_directory.ps1
```

### 6. protect_dss_while_running.bat / protect_dss_while_running.ps1
Applies additional file system protections to prevent deletion of the DSS directory
while backend (port 8000) and frontend (port 3000) servers are running.

**Usage (Command Prompt):**
```cmd
protect_dss_while_running.bat
```

**Usage (PowerShell):**
```powershell
protect_dss_while_running.ps1
```

### 7. enhanced_secure_dss.bat / enhanced_secure_dss.ps1
Applies advanced file system permissions to make token and user directories resilient
against deletion, even by administrators. Provides maximum protection for DSS directories.

**Usage (Command Prompt):**
```cmd
enhanced_secure_dss.bat
```

**Usage (PowerShell):**
```powershell
enhanced_secure_dss.ps1
```

### 8. backup_restore_folders.bat / backup_restore_folders.ps1
Automates backup and restoration of folder structures to prevent data loss.

**Usage (Command Prompt):**
```cmd
backup_restore_folders.bat
```

**Usage (PowerShell):**
```powershell
backup_restore_folders.ps1
```

## How It Works

### In a Real Electron Application:
1. **First Login**: When an employee user logs in for the first time on a machine:
   - The system detects it's running in Node.js environment
   - Uses Node.js `fs` module to create the directory structure
   - Generates a unique machine ID
   - Creates a token file in the `746f6b656e` directory
   - Binds the token to the user account
   - Creates a user directory in `6469726563746f7279` with hex-encoded username

2. **Subsequent Logins**: The system validates existing tokens:
   - Checks if a token file exists for the machine
   - Verifies the token is valid and not expired
   - Ensures the token belongs to the same user

3. **Token Removal**: Only System Administrators and Senior Department Heads can remove tokens:
   - Through the web interface (Machine Tokens admin page)
   - Using the batch scripts (dss_token_manager.bat)

### In Browser Environment (Development/Testing):
- Uses localStorage to simulate the file system behavior
- Directory creation is simulated with localStorage flags
- Token storage is simulated with localStorage items

## Security Implementation

### File System Protection
The `secure_dss_directory` scripts apply the following protections:

1. **Administrators**: Full control over all DSS directories and files
2. **Regular Users**: Read-only access to prevent accidental deletion
3. **Token Directory**: Specifically protected from user modifications
4. **User Directory**: Specifically protected from user modifications

### Runtime Protection
The `protect_dss_while_running` scripts provide additional protections while servers are active:

1. **Enhanced Access Control**: When backend (port 8000) or frontend (port 3000) servers are running, regular users are denied all write, delete, and modify access
2. **Server Monitoring**: Automatically detects when servers are running and applies additional protections
3. **Prevention of Accidental Deletion**: Prevents deletion of DSS directory contents while servers are active

### Enhanced Security
The `enhanced_secure_dss` scripts provide maximum protection for DSS directories:

1. **Advanced ACL Rules**: Even administrators are denied delete access to token and user directories
2. **Special Attributes**: Read-only and system attributes make directories harder to remove
3. **Directory Lock File**: Prevents accidental directory deletion
4. **Maximum Resilience**: Makes directories resilient against deletion from outside the web interface

### Protection Policy
- Direct deletion of DSS directory contents from the file system is prevented
- Only authorized users may remove tokens via the web interface
- Regular users cannot modify or delete token files directly

## Integration with Web Application

The web application automatically detects its environment:
- **Electron Environment**: Uses Node.js file system APIs to interact with the actual directory structure
- **Browser Environment**: Simulates behavior using localStorage for development and testing

## Testing the Implementation

To test the directory creation:

1. Run `run_dss_test.bat` to create the directory structure and a test token
2. Check `C:\Users\Default\AppData\Local\DSS\` to verify the directories were created
3. Verify the token file and user directory exist with proper hex-encoded names
4. Run `secure_dss_directory.bat` to apply basic security protections
5. Run `enhanced_secure_dss.bat` to apply maximum security protections
6. Start the development servers using `fix_run_dev_servers.bat`
7. Run `protect_dss_while_running.bat` to verify additional protections are applied while servers are running

## Recovery from Accidental Deletion

If the DSS directory contents are accidentally deleted:

1. Run `setup_dss_directory.bat` or `run_dss_test.bat` to recreate the directory structure
2. Run `secure_dss_directory.bat` to reapply basic security protections
3. Run `enhanced_secure_dss.bat` to reapply maximum security protections
4. Users will need to log in again to recreate their machine tokens

If you encounter issues while servers are running:

1. Run `protect_dss_while_running.bat` to check if additional protections are active
2. Stop servers using `stop_all_servers.bat` if you need to modify the directory
3. After making changes, restart servers and run `secure_dss_directory.bat` to restore normal permissions

If you need to modify the directory structure with enhanced security:

1. Run `enhanced_secure_dss.bat` to temporarily remove maximum protections
2. Make necessary changes
3. Run `enhanced_secure_dss.bat` again to reapply maximum protections

## Folder Backup and Restoration

If user folders are accidentally deleted or corrupted:

1. Run `backup_restore_folders.bat` to backup or restore folder structures
2. Use the backup command to create periodic backups of folder structures
3. Use the restore command to recover folder structures from backups

When users log in, the system automatically verifies their personal folders exist and restores them from backup if missing.