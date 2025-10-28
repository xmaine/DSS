# DSS Git Update Script

## Overview

This directory contains the `update_git.bat` script for updating the Document Solutions System (DSS) repository and maintaining backups.

## Script: update_git.bat

### Purpose
- Updates the local repository with changes from the remote
- Commits local changes with timestamped messages
- Pushes updates to the main remote repository (Qoder branch)
- Optionally pushes to a backup repository (DSS_Backup) if configured

### Usage
1. Double-click `update_git.bat` or run it from the command line
2. The script will automatically:
   - Pull latest changes from the remote repository
   - Add and commit any local changes
   - Push to the main repository
   - Push to backup repository if configured

### No Local Backups
As per requirements, this script does not create any local backups. All operations are performed through Git commits and pushes to remote repositories.

### Backup Repository Setup
To configure a backup repository, run:
```
git remote add DSS_Backup <backup-repository-url>
```

Replace `<backup-repository-url>` with your actual backup repository URL.