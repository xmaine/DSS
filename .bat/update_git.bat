@echo off
echo Updating local repository and pushing changes to remote...

REM Navigate to the project directory
cd /d D:\PYTHON\Projects\Django\DSS

REM Add all changes
git add .

REM Commit changes with a timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "datestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

git commit -m "Update: Changes committed on %datestamp%"

REM Push to remote repository
git push origin Qoder

echo Update completed successfully!
pause
