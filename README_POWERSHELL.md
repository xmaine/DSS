# PowerShell Server Scripts

Since the batch files aren't working, I've created PowerShell scripts that should work reliably on Windows.

## Files Created

1. **`start_backend.ps1`** - Starts only the Django backend server
2. **`start_frontend.ps1`** - Starts only the React frontend server + opens Chrome
3. **`start_both.ps1`** - Starts both servers + opens Chrome

## How to Use

### Option 1: Start Both Servers (Recommended)
```powershell
# Right-click on start_both.ps1 and select "Run with PowerShell"
# OR open PowerShell and run:
.\start_both.ps1
```

### Option 2: Start Servers Separately
```powershell
# Start backend first:
.\start_backend.ps1

# Then start frontend:
.\start_frontend.ps1
```

## What Each Script Does

### start_backend.ps1
- ✅ Closes existing backend processes on port 8000
- ✅ Checks Python installation
- ✅ Activates virtual environment
- ✅ Starts Django server on port 8000
- ✅ Opens in new command window

### start_frontend.ps1
- ✅ Closes existing frontend processes on port 3000
- ✅ Checks Node.js installation
- ✅ Installs npm dependencies if needed
- ✅ Starts React server on port 3000
- ✅ Opens Chrome browser to http://127.0.0.1:3000/
- ✅ Opens in new command window

### start_both.ps1
- ✅ Does everything from both scripts above
- ✅ Starts backend first, then frontend
- ✅ Opens Chrome automatically

## Troubleshooting

If you get execution policy errors, run this in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## URLs
- Backend API: http://127.0.0.1:8000
- Frontend App: http://127.0.0.1:3000

## Notes
- Keep the server windows open for the servers to run
- You can close the main PowerShell window after servers start
- Chrome will open automatically to the frontend

