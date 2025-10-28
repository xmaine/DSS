import { createDocument, createFolder } from '../../services/api';

/**
 * Debug Upload Service
 * 
 * This module is used to debug and test upload functionality
 */

/**
 * Test file upload with detailed logging
 * @param {File} file - The file to upload
 * @param {Object} user - The current user object
 * @param {Object} selectedFolder - The selected folder (optional)
 * @returns {Promise<Object>} The response from the API
 */
export const debugUploadFile = async (file, user, selectedFolder = null) => {
  try {
    console.log('[DEBUG] Starting file upload debug...');
    console.log('[DEBUG] File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    
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
      console.log('[DEBUG] Associating document with folder:', selectedFolder.id);
    }
    
    // Set the uploader to the current user
    formData.append('uploader', user.id);
    console.log('[DEBUG] Setting uploader to user ID:', user.id);
    
    console.log('[DEBUG] FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log('[DEBUG] ', key, value);
    }
    
    // Log the raw request
    console.log('[DEBUG] Making API request to create document...');
    const response = await createDocument(formData);
    console.log('[DEBUG] Document creation response:', response);
    
    return response;
  } catch (error) {
    console.error('[DEBUG] Error uploading file:', file.name, error);
    console.error('[DEBUG] Error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Test folder creation with detailed logging
 * @param {string} folderName - The name of the folder to create
 * @param {Object} user - The current user object
 * @param {Object} selectedFolder - The parent folder (optional)
 * @returns {Promise<Object>} The response from the API
 */
export const debugCreateFolder = async (folderName, user, selectedFolder = null) => {
  try {
    console.log('[DEBUG] Starting folder creation debug...');
    console.log('[DEBUG] Folder name:', folderName);
    console.log('[DEBUG] User:', user);
    console.log('[DEBUG] Selected folder:', selectedFolder);
    
    // Create folder data
    const folderData = {
      name: folderName,
      owner: user.id,
      is_active: true
    };
    
    // If a folder is selected, set it as the parent
    if (selectedFolder) {
      folderData.parent_folder = selectedFolder.id;
    }
    
    console.log('[DEBUG] Folder data to send:', folderData);
    
    // Log the raw request
    console.log('[DEBUG] Making API request to create folder...');
    const response = await createFolder(folderData);
    console.log('[DEBUG] Folder creation response:', response);
    
    return response;
  } catch (error) {
    console.error('[DEBUG] Error creating folder:', folderName, error);
    console.error('[DEBUG] Error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export default {
  debugUploadFile,
  debugCreateFolder
};