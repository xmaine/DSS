HOW TO START DEVELOPMENT SERVERS
===============================

Because of PowerShell execution policies and output handling, please follow these steps:

METHOD 1: Using Command Prompt (Recommended)
--------------------------------------------
1. Open Command Prompt (NOT PowerShell)
2. Navigate to your project directory:
   cd /d D:\PYTHON\Projects\Django\DSS
3. Run the batch file:
   run_dev_servers.bat

METHOD 2: Manual Server Start
-----------------------------
1. Open a new Command Prompt window
2. Navigate to the backend directory:
   cd D:\PYTHON\Projects\Django\DSS\backend
3. Start the Django server:
   python manage.py runserver 8000

4. Open another Command Prompt window
5. Navigate to the frontend directory:
   cd D:\PYTHON\Projects\Django\DSS\frontend
6. Start the React server:
   npm start

METHOD 3: Using PowerShell Manually
-----------------------------------
1. Open PowerShell
2. Navigate to the project directory (you're already here)
3. Check that files exist:
   Test-Path "backend\manage.py"     # Should return True
   Test-Path "frontend\package.json" # Should return True

4. Start backend server in new window:
   Start-Process -FilePath "cmd" -ArgumentList "/k cd backend && python manage.py runserver 8000" -WorkingDirectory "D:\PYTHON\Projects\Django\DSS"

5. Start frontend server in new window:
   Start-Process -FilePath "cmd" -ArgumentList "/k cd frontend && npm start" -WorkingDirectory "D:\PYTHON\Projects\Django\DSS"

TROUBLESHOOTING
---------------
If you still encounter issues:

1. Make sure you're in the correct directory:
   Get-Location
   
2. Check that required files exist:
   Get-ChildItem backend\manage.py
   Get-ChildItem frontend\package.json
   
3. Verify Python and Node.js are installed:
   python --version
   node --version

4. If you get permission errors with PowerShell scripts, run:
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   (Then try running the .ps1 script again)