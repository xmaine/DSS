# Document Solutions - Server Startup Scripts

## Overview
This document explains how to properly start the development servers for the Document Solutions application.

## Scripts Location
All batch scripts are located in the `.bat` directory:
- `run_dev_servers.bat` - Standard development server startup
- `run_dev_servers_advanced.bat` - Advanced server startup with port checking
- `stop_all_servers.bat` - Stops all running servers
- `check_ports.bat` - Checks port status
- `simple_check.bat` - Simple directory check
- `test_dir.bat` - Directory diagnostic tool
- `test_file_check.bat` - File existence verification
- `debug_check.bat` - Detailed debugging information
- `minimal_test.bat` - Minimal file check
- `update_git.bat` - Git backup and synchronization

## Running the Scripts
You can run any of the scripts from the `.bat` directory. The scripts will automatically navigate to the project root directory before performing checks.

### From Command Prompt:
```cmd
cd D:\PYTHON\Projects\Django\DSS\.bat
run_dev_servers.bat
```

### From PowerShell:
```powershell
cd D:\PYTHON\Projects\Django\DSS\.bat
.\run_dev_servers.bat
```

## How the Scripts Work
1. The script automatically navigates to the project root directory
2. **Stops any existing servers** to ensure only one instance runs
3. Performs all necessary checks and setups (dependencies, virtual environment, etc.)
4. Starts both Django backend (port 8000) and React frontend (port 3000) servers in separate command windows
5. Displays success messages when servers are running
6. Automatically opens Google Chrome browser to http://127.0.0.1:3000/
7. Shows detailed instructions about the server windows

**IMPORTANT**: When you see "Press any key to close this window", it only refers to the main script window. Two additional command windows will be opened:
- **Django Backend Server** window (must remain open)
- **React Frontend Server** window (must remain open)

These windows contain the actual running servers and must stay open for the application to work.

## Stopping Servers
To stop all servers, you can:
1. Close the Django Backend Server and React Frontend Server windows manually
2. Run the `stop_all_servers.bat` script:
   ```cmd
   cd D:\PYTHON\Projects\Django\DSS\.bat
   stop_all_servers.bat
   ```

## Troubleshooting
If you encounter issues:
1. Ensure you're running the script from the `.bat` directory
2. Check that the backend and frontend directories exist in the project root
3. Verify that manage.py and package.json files are present
4. Confirm Python and Node.js are installed and in your PATH
5. Make sure Google Chrome is installed (required for automatic browser opening)
6. Check that ports 8000 and 3000 are not already in use

## Recent Fixes
- Fixed directory navigation issue where scripts were failing when run from the `.bat` directory
- Scripts now automatically change to the project root directory before performing checks
- Improved error messages and debugging information
- Added automatic Google Chrome browser opening to frontend URL (http://127.0.0.1:3000/)
- Enhanced server startup sequence with better timing and error handling
- Added explicit success messages when servers are running
- Implemented multiple methods to open Chrome browser for better compatibility
- Added port checking to verify servers are actually running
- Added clear instructions about server windows that must remain open
- **Enhanced port management**: Automatically stops existing servers before starting new ones
- **Added stop_all_servers.bat**: Dedicated script to stop all running servers