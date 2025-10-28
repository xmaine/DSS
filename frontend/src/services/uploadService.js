import { createDocument, createFolder } from './api';

/**
 * Upload Service
 * 
 * This module handles all file and folder upload operations
 * with proper error handling and validation.
 */

/**
 * Upload a single file
 * @param {File} file - The file to upload
 * @param {Object} user - The current user object
 * @param {Object} selectedFolder - The selected folder (optional)
 * @returns {Promise<Object>} The response from the API
 */
export const uploadFile = async (file, user, selectedFolder = null) => {
  try {
    console.log('[UPLOAD SERVICE] Uploading file:', file.name);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', file.name);
    formData.append('file', file);
    formData.append('original_filename', file.name);
    formData.append('file_size', file.size);
    formData.append('mime_type', file.type);
    
    // If a folder is selected, associate the document with that folder
    if (selectedFolder) {
      formData.append('folder', selectedFolder.id);
      console.log('[UPLOAD SERVICE] Associating document with folder:', selectedFolder.id);
    }
    
    // Set the uploader to the current user
    formData.append('uploader', user.id);
    console.log('[UPLOAD SERVICE] Setting uploader to user ID:', user.id);
    
    console.log('[UPLOAD SERVICE] FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log('[UPLOAD SERVICE] ', key, value);
    }
    
    // Call the API to create the document
    const response = await createDocument(formData);
    console.log('[UPLOAD SERVICE] Document creation response:', response);
    
    return response;
  } catch (error) {
    console.error('[UPLOAD SERVICE] Error uploading file:', file.name, error);
    console.error('[UPLOAD SERVICE] Error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Upload multiple files
 * @param {FileList} files - The files to upload
 * @param {Object} user - The current user object
 * @param {Object} selectedFolder - The selected folder (optional)
 * @returns {Promise<Object>} Object containing successCount and errorCount
 */
export const uploadMultipleFiles = async (files, user, selectedFolder = null) => {
  try {
    console.log('[UPLOAD SERVICE] Uploading multiple files:', files.length);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    // Upload each file sequentially to avoid overwhelming the server
    for (const file of files) {
      try {
        console.log(`[UPLOAD SERVICE] Uploading file ${file.name} (${file.size} bytes)`);
        const response = await uploadFile(file, user, selectedFolder);
        
        // Check if the response indicates success
        if (response && (response.status === 201 || (response.data && response.data.id))) {
          console.log(`[UPLOAD SERVICE] Successfully uploaded file: ${file.name}`);
          successCount++;
        } else {
          console.error(`[UPLOAD SERVICE] Failed to upload file: ${file.name}`);
          errorCount++;
          errors.push({ fileName: file.name, error: 'Upload failed with unknown error' });
        }
      } catch (fileError) {
        errorCount++;
        errors.push({ fileName: file.name, error: fileError.message });
        console.error(`[UPLOAD SERVICE] Error uploading file ${file.name}:`, fileError);
      }
    }
    
    console.log(`[UPLOAD SERVICE] Upload complete - Success: ${successCount}, Errors: ${errorCount}`);
    return { successCount, errorCount, errors };
  } catch (error) {
    console.error('[UPLOAD SERVICE] Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Create a new folder
 * @param {string} folderName - The name of the folder to create
 * @param {Object} user - The current user object
 * @param {Object} selectedFolder - The parent folder (optional)
 * @returns {Promise<Object>} The response from the API
 */
export const createNewFolder = async (folderName, user, selectedFolder = null) => {
  try {
    console.log('[UPLOAD SERVICE] Creating folder:', folderName);
    
    // Create folder data
    const folderData = {
      name: folderName,
      owner: user.id,
      is_active: true
    };
    
    // If a folder is selected, set it as the parent
    if (selectedFolder) {
      folderData.parent_folder = selectedFolder.id;
      console.log('[UPLOAD SERVICE] Setting parent folder:', selectedFolder.id);
    } else {
      console.log('[UPLOAD SERVICE] No parent folder selected, creating root folder');
    }
    
    console.log('[UPLOAD SERVICE] Folder data to send:', folderData);
    
    // Call the API to create the folder
    const response = await createFolder(folderData);
    console.log('[UPLOAD SERVICE] Folder creation response:', response);
    
    return response;
  } catch (error) {
    console.error('[UPLOAD SERVICE] Error creating folder:', folderName, error);
    console.error('[UPLOAD SERVICE] Error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

// Export as default object
export default {
  uploadFile,
  uploadMultipleFiles,
  createNewFolder
};