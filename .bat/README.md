# Batch Scripts

This folder contains all batch scripts for the Document Solutions System.

## Available Scripts

### Development Scripts
- `run_dev_servers.bat` - Starts both frontend and backend development servers
- `run_dev_servers_advanced.bat` - Advanced version with additional options for development servers

### Git Scripts
- `update_git.bat` - Updates the local repository with the latest changes from remote and pushes local changes to the remote Git repository

### Testing Scripts
- `debug_check.bat` - Runs debug checks on the system
- `minimal_test.bat` - Runs minimal tests
- `simple_check.bat` - Runs simple system checks
- `test_dir.bat` - Tests directory operations
- `test_file_check.bat` - Checks test files

## Usage

To run any script, simply double-click on the `.bat` file or run it from the command line:

```cmd
.bat\script_name.bat
```

## Notes

- All scripts should be run from the project root directory
- Make sure you have the required dependencies installed before running the scripts
- Some scripts may require administrator privileges
- The `update_git.bat` script will commit local changes and push them to the remote Git repository