import { createNewFolder, uploadFile } from '../../services/uploadService';

/**
 * Folder Upload Manager
 * 
 * This module handles folder uploads by allowing users to select a directory
 * and upload its entire structure, including subfolders and files.
 */

class FolderUploadManager {
  constructor(user, selectedFolder, onUploadComplete, onError) {
    this.user = user;
    this.selectedFolder = selectedFolder;
    this.onUploadComplete = onUploadComplete;
    this.onError = onError;
    this.abortController = null;
  }

  /**
   * Handle folder upload by allowing user to select a directory
   */
  handleFolderUpload = async () => {
    try {
      console.log('[FOLDER UPLOAD MANAGER] Initiating folder upload');
      
      // Check if the browser supports directory uploads
      if (typeof window.showDirectoryPicker === 'undefined') {
        // Fallback for browsers that don't support showDirectoryPicker
        console.log('[FOLDER UPLOAD MANAGER] Directory picker not supported, using fallback');
        await this.handleFolderUploadFallback();
        return;
      }
      
      // Show directory picker
      const dirHandle = await window.showDirectoryPicker();
      
      // Process the selected directory
      await this.processDirectory(dirHandle, this.selectedFolder);
      
      // Notify completion
      if (this.onUploadComplete) {
        this.onUploadComplete({ successCount: 1, errorCount: 0, errors: [] });
      }
      
      alert(`Folder "${dirHandle.name}" uploaded successfully!`);
    } catch (error) {
      console.error('[FOLDER UPLOAD MANAGER] Error during folder upload:', error);
      
      if (error.name === 'AbortError') {
        alert('Folder upload cancelled.');
        return;
      }
      
      if (this.onError) {
        this.onError(error);
      }
      
      let errorMessage = 'Unknown error';
      if (error.message) {
        errorMessage = error.message;
      }
      
      alert('Error uploading folder: ' + errorMessage);
    }
  };

  /**
   * Fallback method for browsers that don't support directory picker
   */
  handleFolderUploadFallback = async () => {
    // For browsers that don't support showDirectoryPicker, we'll create a folder
    // and inform the user that full folder upload is not supported
    const folderName = prompt('Enter the name for the new folder:');
    if (folderName) {
      try {
        const response = await createNewFolder(folderName, this.user, this.selectedFolder);
        if (response && (response.status === 201 || (response.data && response.data.id))) {
          if (this.onUploadComplete) {
            this.onUploadComplete({ successCount: 1, errorCount: 0, errors: [] });
          }
          alert(`Folder "${folderName}" created successfully!\n\nNote: Your browser does not support uploading entire folder structures. You can upload files individually to this folder.`);
        } else {
          const errorMessage = response?.data?.detail || response?.data?.error || response?.data?.message || 'Unknown error';
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('[FOLDER UPLOAD MANAGER] Error creating folder in fallback:', error);
        throw error;
      }
    }
  };

  /**
   * Process a directory and all its contents recursively
   */
  processDirectory = async (dirHandle, parentFolder = null) => {
    try {
      console.log(`[FOLDER UPLOAD MANAGER] Processing directory: ${dirHandle.name}`);
      
      // Create the folder in the system
      const folderResponse = await createNewFolder(dirHandle.name, this.user, parentFolder);
      const createdFolder = folderResponse.data;
      
      console.log(`[FOLDER UPLOAD MANAGER] Created folder: ${createdFolder.name} (ID: ${createdFolder.id})`);
      
      // Process all entries in the directory
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          // Process file
          await this.processFile(entry, createdFolder);
        } else if (entry.kind === 'directory') {
          // Process subdirectory recursively
          await this.processDirectory(entry, createdFolder);
        }
      }
    } catch (error) {
      console.error(`[FOLDER UPLOAD MANAGER] Error processing directory ${dirHandle.name}:`, error);
      throw error;
    }
  };

  /**
   * Process a file and upload it
   */
  processFile = async (fileHandle, parentFolder = null) => {
    try {
      console.log(`[FOLDER UPLOAD MANAGER] Processing file: ${fileHandle.name}`);
      
      // Get the file object
      const file = await fileHandle.getFile();
      
      // Upload the file
      await uploadFile(file, this.user, parentFolder);
      
      console.log(`[FOLDER UPLOAD MANAGER] Uploaded file: ${fileHandle.name}`);
    } catch (error) {
      console.error(`[FOLDER UPLOAD MANAGER] Error processing file ${fileHandle.name}:`, error);
      throw error;
    }
  };

  /**
   * Cancel ongoing upload
   */
  cancelUpload = () => {
    if (this.abortController) {
      this.abortController.abort();
    }
  };
}

export default FolderUploadManager;