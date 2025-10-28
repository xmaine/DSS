import { useState } from 'react';
import { uploadMultipleFiles, createNewFolder } from '../../services/uploadService';
import FolderUploadManager from './FolderUploadManager';

/**
 * Upload Manager Hook
 * 
 * This hook handles all file and folder upload operations
 * with proper state management and error handling.
 */

const useUploadManager = (user, selectedFolder, onUploadComplete, onError) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Handle file upload
   */
  const handleFileUpload = async () => {
    try {
      console.log('[UPLOAD MANAGER] Initiating file upload');
      
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true; // Allow multiple file selection
      fileInput.onchange = async (e) => {
        const files = e.target.files;
        console.log('[UPLOAD MANAGER] Selected files:', files);
        
        if (files && files.length > 0) {
          setIsUploading(true);
          setUploadProgress(0);
          
          try {
            console.log(`[UPLOAD MANAGER] Starting upload of ${files.length} files`);
            const result = await uploadMultipleFiles(files, user, selectedFolder);
            
            setIsUploading(false);
            setUploadProgress(0);
            
            console.log('[UPLOAD MANAGER] Upload result:', result);
            
            if (onUploadComplete) {
              onUploadComplete(result);
            }
            
            // Show results to user
            if (result.errorCount > 0) {
              const errorMessages = result.errors.map(e => `${e.fileName}: ${e.error}`).join('\n');
              alert(`${result.successCount} file(s) uploaded successfully, ${result.errorCount} failed.\n\nErrors:\n${errorMessages}`);
            } else {
              alert(`${result.successCount} file(s) uploaded successfully!`);
            }
          } catch (error) {
            setIsUploading(false);
            setUploadProgress(0);
            
            console.error('[UPLOAD MANAGER] Error uploading files:', error);
            if (onError) {
              onError(error);
            }
            
            // Try to get a more specific error message
            let errorMessage = 'Unknown error';
            if (error.response?.data) {
              if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
              } else if (error.response.data.detail) {
                errorMessage = error.response.data.detail;
              } else if (error.response.data.error) {
                errorMessage = error.response.data.error;
              } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
              } else {
                errorMessage = JSON.stringify(error.response.data);
              }
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            alert('Error uploading files: ' + errorMessage);
          }
        } else {
          console.log('[UPLOAD MANAGER] No files selected');
        }
      };
      fileInput.click();
    } catch (error) {
      console.error('[UPLOAD MANAGER] Error setting up file upload:', error);
      if (onError) {
        onError(error);
      }
      alert('Error setting up file upload: ' + error.message);
    }
  };

  /**
   * Handle folder creation
   */
  const handleCreateFolder = async () => {
    try {
      console.log('[UPLOAD MANAGER] Initiating folder creation');
      
      // Use a prompt to get the folder name
      const folderName = prompt('Enter the name for the new folder:');
      if (folderName) {
        // Validate folder name
        if (folderName.trim().length === 0) {
          alert('Folder name cannot be empty');
          return;
        }
        
        setIsUploading(true);
        
        try {
          console.log(`[UPLOAD MANAGER] Creating folder: ${folderName}`);
          const response = await createNewFolder(folderName, user, selectedFolder);
          
          setIsUploading(false);
          
          console.log('[UPLOAD MANAGER] Folder creation response:', response);
          
          // Check if the response indicates success
          if (response && (response.status === 201 || (response.data && response.data.id))) {
            console.log('[UPLOAD MANAGER] Folder created successfully');
            if (onUploadComplete) {
              onUploadComplete({ successCount: 1, errorCount: 0, errors: [] });
            }
            alert(`Folder "${folderName}" created successfully!`);
          } else {
            console.error('[UPLOAD MANAGER] Folder creation failed');
            const errorMessage = response?.data?.detail || response?.data?.error || response?.data?.message || 'Unknown error';
            if (onError) {
              onError(new Error(errorMessage));
            }
            alert(`Error creating folder: ${errorMessage}`);
          }
        } catch (error) {
          setIsUploading(false);
          console.error('[UPLOAD MANAGER] Error creating folder:', error);
          
          // Check if this is a permission error
          let errorMessage = 'Unknown error';
          if (error.response?.data) {
            if (typeof error.response.data === 'string') {
              errorMessage = error.response.data;
            } else if (error.response.data.detail) {
              errorMessage = error.response.data.detail;
            } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
            } else {
              errorMessage = JSON.stringify(error.response.data);
            }
            
            // Check for permission denied errors
            if (error.response?.status === 403) {
              if (user && user.role === 'EMPLOYEE') {
                errorMessage = 'Employees do not have permission to create folders. Please contact your administrator.';
              }
            }
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          if (onError) {
            onError(error);
          }
          alert('Error creating folder: ' + errorMessage);
        }
      }
    } catch (error) {
      console.error('[UPLOAD MANAGER] Error setting up folder creation:', error);
      if (onError) {
        onError(error);
      }
      alert('Error setting up folder creation: ' + error.message);
    }
  };

  /**
   * Handle folder upload (now properly implemented with directory support)
   */
  const handleFolderUpload = async () => {
    try {
      console.log('[UPLOAD MANAGER] Initiating folder upload');
      
      // Create folder upload manager
      const folderUploadManager = new FolderUploadManager(
        user,
        selectedFolder,
        onUploadComplete,
        onError
      );
      
      // Handle the folder upload
      await folderUploadManager.handleFolderUpload();
    } catch (error) {
      console.error('[UPLOAD MANAGER] Error setting up folder upload:', error);
      if (onError) {
        onError(error);
      }
      // Check if it's a browser compatibility issue
      if (error.message && error.message.includes('showDirectoryPicker')) {
        alert('Folder upload is not supported in your browser. Please use Chrome, Edge, or another supported browser.');
      } else {
        alert('Error setting up folder upload: ' + error.message);
      }
    }
  };

  return {
    handleFileUpload,
    handleCreateFolder,
    handleFolderUpload,
    isUploading,
    uploadProgress
  };
};

export default useUploadManager;