# Upload Functionality Documentation

## Overview
This directory contains all the components and services related to file and folder upload functionality for the Employee role in the Document Storage System.

## Components

### 1. useUploadManager.js
A React hook that manages all file and folder upload operations with proper state management and error handling.

**Key Features:**
- Handles file selection and upload
- Manages folder creation
- Provides upload progress state
- Includes comprehensive error handling

### 2. uploadService.js
A service module that handles the actual API calls for uploading files and creating folders.

**Key Functions:**
- `uploadFile`: Uploads a single file
- `uploadMultipleFiles`: Uploads multiple files sequentially
- `createNewFolder`: Creates a new folder

### 3. Test Components
For debugging and testing purposes:

#### TestUploadComponent.js
A UI component for testing upload functionality with manual controls.

#### ApiTestComponent.js
A component for testing individual API endpoints related to uploads.

#### debugUpload.js
Utility functions for debugging upload operations with detailed logging.

## Usage

### In EmployeeDocumentsPage.js
The upload functionality is integrated into the EmployeeDocumentsPage through the useUploadManager hook:

```javascript
import useUploadManager from '../upload/useUploadManager';

// Initialize the upload manager hook
const { handleFileUpload, handleCreateFolder } = useUploadManager(
  user,
  selectedFolder,
  fetchData, // onUploadComplete - refresh data after upload
  (error) => console.error('Upload error:', error) // onError
);
```

## Error Handling
All upload operations include comprehensive error handling:
- Detailed logging to the console
- User-friendly error messages
- Proper state management during upload operations

## Debugging
To debug upload issues:
1. Open the browser's developer tools
2. Check the Console tab for detailed logs
3. Check the Network tab to verify API requests
4. Look for errors in the React component tree

## Testing
To test the upload functionality:
1. Use the TestUploadComponent for manual testing
2. Use the ApiTestComponent to test individual API endpoints
3. Verify that files appear in the correct folders
4. Check that the UI updates properly after uploads

## Common Issues and Solutions

### 1. Files not uploading
- Check browser console for errors
- Verify that the backend server is running
- Ensure the user has proper permissions

### 2. Folders not creating
- Check that folder names are not empty
- Verify parent folder relationships
- Check for database constraints

### 3. Uploads failing with permission errors
- Verify user authentication
- Check folder ownership permissions
- Ensure the user has the EMPLOYEE role

## API Endpoints Used

### Document Management
- `POST /api/documents/` - Create a new document
- `GET /api/documents/` - Retrieve documents

### Folder Management
- `POST /api/folders/` - Create a new folder
- `GET /api/folders/` - Retrieve folders

## File Structure
```
upload/
├── useUploadManager.js      # React hook for upload management
├── uploadService.js         # Service for API calls
├── debugUpload.js           # Debugging utilities
├── TestUploadComponent.js   # UI component for testing
├── ApiTestComponent.js      # API endpoint testing
└── README.md                # This documentation
```