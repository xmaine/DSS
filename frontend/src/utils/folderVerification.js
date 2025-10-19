/**
 * Folder Verification Utility
 * 
 * This module handles verification of user folders and restoration from backup
 * when folders are missing upon login.
 */

import { getFolders, createFolder } from '../services/api';

/**
 * Verify if the user's personal folder exists
 * @param {Object} user - The logged-in user object
 * @returns {Promise<boolean>} Whether the folder exists
 */
export const verifyUserFolder = async (user) => {
  try {
    console.log('FolderVerification: Verifying folder for user:', user.username);
    
    // Get all folders accessible to the user
    const response = await getFolders();
    const folders = response.data;
    
    console.log('FolderVerification: Retrieved folders:', folders);
    
    // Check if user's personal folder exists
    const personalFolderName = `${user.username}'s Documents`;
    console.log('FolderVerification: Looking for folder named:', personalFolderName);
    console.log('FolderVerification: User ID:', user.id);
    console.log('FolderVerification: All folders:', folders);
    
    const personalFolder = folders.find(folder => {
      const isNameMatch = folder.name === personalFolderName;
      const isOwnerMatch = folder.owner === user.id;
      console.log(`FolderVerification: Checking folder ${folder.name} (ID: ${folder.id}) - Name match: ${isNameMatch}, Owner match: ${isOwnerMatch} (folder.owner: ${folder.owner}, user.id: ${user.id})`);
      return isNameMatch && isOwnerMatch;
    });
    
    if (personalFolder) {
      console.log('FolderVerification: Personal folder found:', personalFolder);
      return true;
    } else {
      console.log('FolderVerification: Personal folder not found for user:', user.username);
      return false;
    }
  } catch (error) {
    console.error('FolderVerification: Error verifying user folder:', error);
    return false;
  }
};

/**
 * Restore user's personal folder from backup
 * @param {Object} user - The logged-in user object
 * @returns {Promise<boolean>} Whether the folder was successfully restored
 */
export const restoreUserFolder = async (user) => {
  try {
    console.log('FolderVerification: Restoring folder for user:', user.username);
    
    // Create the personal folder for the user
    const personalFolderName = `${user.username}'s Documents`;
    const folderData = {
      name: personalFolderName,
      owner: user.id,
      path: user.department ? `/${user.department} Documents/${personalFolderName}` : `/${personalFolderName}`,
      is_active: true
    };
    
    console.log('FolderVerification: Creating folder with data:', folderData);
    
    try {
      const response = await createFolder(folderData);
      console.log('FolderVerification: Folder created successfully:', response.data);
      return true;
    } catch (createError) {
      console.error('FolderVerification: Error creating folder:', createError);
      
      // Log detailed error information
      if (createError.response) {
        console.error('FolderVerification: Error response status:', createError.response.status);
        console.error('FolderVerification: Error response data:', createError.response.data);
        
        // Check for specific validation errors
        if (createError.response.data) {
          Object.keys(createError.response.data).forEach(field => {
            console.error(`FolderVerification: Validation error for field '${field}':`, createError.response.data[field]);
          });
        }
      } else if (createError.request) {
        console.error('FolderVerification: No response received:', createError.request);
      } else {
        console.error('FolderVerification: Error setting up request:', createError.message);
      }
      
      // Don't throw the error, just return false so the login can continue
      // The user will see an error message about the folder verification
      return false;
    }
  } catch (error) {
    console.error('FolderVerification: Error restoring user folder:', error);
    return false;
  }
};

/**
 * Verify and restore user folder if missing
 * @param {Object} user - The logged-in user object
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const verifyAndRestoreUserFolder = async (user) => {
  try {
    console.log('FolderVerification: Starting verification and restoration for user:', user.username);
    
    // Only perform this check for employee users
    if (user.role !== 'EMPLOYEE') {
      console.log('FolderVerification: User is not an employee, skipping folder verification');
      return true;
    }
    
    // Verify if user's personal folder exists
    const folderExists = await verifyUserFolder(user);
    
    if (folderExists) {
      console.log('FolderVerification: User folder exists, no restoration needed');
      return true;
    } else {
      console.log('FolderVerification: User folder missing, attempting restoration');
      const restorationSuccess = await restoreUserFolder(user);
      
      if (restorationSuccess) {
        console.log('FolderVerification: User folder restored successfully');
        return true;
      } else {
        console.error('FolderVerification: Failed to restore user folder');
        return false;
      }
    }
  } catch (error) {
    console.error('FolderVerification: Error in verifyAndRestoreUserFolder:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('FolderVerification: Error response status:', error.response.status);
      console.error('FolderVerification: Error response data:', error.response.data);
    } else if (error.request) {
      console.error('FolderVerification: No response received:', error.request);
    } else {
      console.error('FolderVerification: Error setting up request:', error.message);
    }
    
    return false;
  }
};

const folderVerification = {
  verifyUserFolder,
  restoreUserFolder,
  verifyAndRestoreUserFolder
};

export default folderVerification;