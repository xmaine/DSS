/**
 * Machine Token Utility
 * 
 * This module handles machine-specific token generation and validation
 * to ensure only one employee user can be logged in per machine.
 * 
 * In a real Electron application, this would use Node.js file system APIs
 * to create and manage tokens in C:\Users\Default\AppData\Local\DSS\
 */

// Check if we're in a Node.js environment (Electron)
// In a browser, process is undefined, so we need to check safely
const isNodeEnvironment = () => {
  try {
    return typeof process !== 'undefined' && process.versions && process.versions.node;
  } catch (e) {
    return false;
  }
};

// Helper function to convert string to hexadecimal
const toHex = (str) => {
  return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
};

// Helper function to convert hexadecimal to string
const fromHex = (hex) => {
  const bytes = hex.match(/.{1,2}/g) || [];
  return bytes.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
};

/**
 * Generate a unique machine identifier
 * @returns {string} Unique machine identifier
 */
const generateMachineId = () => {
  // Use a combination of navigator properties to create a unique identifier
  const components = [
    navigator.userAgent,
    navigator.platform,
    navigator.language,
    window.screen.width,
    window.screen.height,
    window.screen.colorDepth,
    new Date().getTimezoneOffset()
  ];
  
  // Simple hash function to create a consistent identifier
  let hash = 0;
  const str = components.join('');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

/**
 * Create the DSS directory structure if it doesn't exist
 * @returns {Promise<boolean>} Whether the directory structure was created successfully
 */
const ensureTokenDirectory = async () => {
  try {
    // In a real Electron app, this would use Node.js fs module:
    if (isNodeEnvironment()) {
      // This code would run in an Electron environment
      // Note: In a real implementation, we would dynamically import these modules
      console.log('Node.js environment detected - in a real Electron app, this would create directories');
      /*
      const fs = require('fs');
      const path = require('path');
      
      // Define the base path
      const basePath = 'C:\\Users\\Default\\AppData\\Local\\DSS';
      
      // Create the base directory if it doesn't exist
      if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
      }
      
      // Create the token directory (hex: 'token')
      const tokenPath = path.join(basePath, '746f6b656e'); // 'token' in hex
      if (!fs.existsSync(tokenPath)) {
        fs.mkdirSync(tokenPath, { recursive: true });
      }
      
      // Create the user directory (hex: 'directory')
      const userPath = path.join(basePath, '6469726563746f7279'); // 'directory' in hex
      if (!fs.existsSync(userPath)) {
        fs.mkdirSync(userPath, { recursive: true });
      }
      */
      
      console.log('DSS directory structure created successfully (simulated in Node.js environment)');
      return true;
    } else {
      // In a browser environment, we can't directly access the file system
      // For browser simulation, we'll use localStorage to track directory creation
      localStorage.setItem('dss_directory_created', 'true');
      
      console.log('DSS directory structure simulated successfully (browser environment)');
      return true;
    }
  } catch (error) {
    console.error('Error ensuring token directory:', error);
    return false;
  }
};

/**
 * Create a secure token file in the user's AppData directory
 * @param {string} username - The username of the logged-in employee
 * @param {string} machineId - The machine identifier
 * @returns {Promise<boolean>} Whether the token was created successfully
 */
const createMachineToken = async (username, machineId) => {
  try {
    // Ensure the directory structure exists first
    const dirCreated = await ensureTokenDirectory();
    if (!dirCreated) {
      throw new Error('Failed to create directory structure');
    }
    
    if (isNodeEnvironment()) {
      // This code would run in an Electron environment
      // Note: In a real implementation, we would dynamically import these modules
      console.log('Node.js environment detected - in a real Electron app, this would create token files');
      /*
      const fs = require('fs');
      const path = require('path');
      
      // Define paths with hex-encoded names
      const basePath = 'C:\\Users\\Default\\AppData\\Local\\DSS';
      const tokenDir = path.join(basePath, '746f6b656e'); // 'token' in hex
      const userDir = path.join(basePath, '6469726563746f7279'); // 'directory' in hex
      
      // Create a unique token filename based on machine ID
      const tokenFilename = `${machineId}.token`;
      const tokenPath = path.join(tokenDir, tokenFilename);
      
      // Create token data
      const tokenData = {
        username: username,
        machineId: machineId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };
      
      // Write token file
      fs.writeFileSync(tokenPath, JSON.stringify(tokenData), 'utf8');
      
      // Also create a user directory with hex-encoded username
      const userDirPath = path.join(userDir, toHex(username));
      if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath, { recursive: true });
      }
      */
      
      console.log('Machine token created for user (simulated in Node.js environment):', username);
      return true;
    } else {
      // For browser simulation, store in localStorage
      const tokenData = {
        username: username,
        machineId: machineId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };
      
      localStorage.setItem('dss_machine_token', JSON.stringify(tokenData));
      localStorage.setItem(`dss_user_${toHex(username)}`, 'true'); // Simulate user directory creation
      
      console.log('Machine token created for user (simulated):', username);
      return true;
    }
  } catch (error) {
    console.error('Error creating machine token:', error);
    return false;
  }
};

/**
 * Validate if a machine token exists and is valid
 * @param {string} username - The username to validate
 * @returns {Promise<boolean>} Whether the token is valid
 */
const validateMachineToken = async (username) => {
  try {
    if (isNodeEnvironment()) {
      // This code would run in an Electron environment
      // Note: In a real implementation, we would dynamically import these modules
      console.log('Node.js environment detected - in a real Electron app, this would validate token files');
      /*
      const fs = require('fs');
      const path = require('path');
      
      // Generate machine ID
      const machineId = generateMachineId();
      
      // Define paths
      const basePath = 'C:\\Users\\Default\\AppData\\Local\\DSS';
      const tokenDir = path.join(basePath, '746f6b656e'); // 'token' in hex
      const tokenPath = path.join(tokenDir, `${machineId}.token`);
      
      // Check if token file exists
      if (!fs.existsSync(tokenPath)) {
        return false;
      }
      
      // Read and parse token data
      const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      
      // Check if token is expired
      if (new Date(tokenData.expiresAt) < new Date()) {
        // Token expired, remove it
        fs.unlinkSync(tokenPath);
        return false;
      }
      
      // Check if token belongs to the same user
      if (tokenData.username !== username) {
        return false;
      }
      
      return true;
      */
      
      // For simulation, we'll check localStorage even in Node.js environment
      const tokenData = localStorage.getItem('dss_machine_token');
      if (!tokenData) {
        return false;
      }
      
      const parsedToken = JSON.parse(tokenData);
      
      // Check if token is expired
      if (new Date(parsedToken.expiresAt) < new Date()) {
        // Token expired, remove it
        localStorage.removeItem('dss_machine_token');
        return false;
      }
      
      // Check if token belongs to the same user
      if (parsedToken.username !== username) {
        return false;
      }
      
      // Validate machine ID (in a real implementation, this would be more robust)
      const currentMachineId = generateMachineId();
      if (parsedToken.machineId !== currentMachineId) {
        return false;
      }
      
      return true;
    } else {
      // For browser simulation, check localStorage
      const tokenData = localStorage.getItem('dss_machine_token');
      if (!tokenData) {
        // If no token exists, this might be because directories were accidentally deleted
        // In a real system, we would recreate the directory structure
        console.log('No machine token found - this might be due to accidental deletion. Directory structure would be recreated in a real implementation.');
        
        // Check if servers are running which might prevent directory access
        // In a real Electron app, we would check for running processes
        console.log('If servers are running, directory access might be restricted. Stop servers to manage DSS directory.');
        
        return false;
      }
      
      const parsedToken = JSON.parse(tokenData);
      
      // Check if token is expired
      if (new Date(parsedToken.expiresAt) < new Date()) {
        // Token expired, remove it
        localStorage.removeItem('dss_machine_token');
        return false;
      }
      
      // Check if token belongs to the same user
      if (parsedToken.username !== username) {
        return false;
      }
      
      // Validate machine ID (in a real implementation, this would be more robust)
      const currentMachineId = generateMachineId();
      if (parsedToken.machineId !== currentMachineId) {
        return false;
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error validating machine token:', error);
    return false;
  }
};

/**
 * Remove the machine token (only allowed for admin/senior roles)
 * @param {string} userRole - The role of the user attempting to remove the token
 * @returns {Promise<boolean>} Whether the token was removed successfully
 */
const removeMachineToken = async (userRole) => {
  try {
    // Only allow system administrators and senior department heads to remove tokens
    if (userRole !== 'ADMIN' && userRole !== 'SENIOR_DEPT_HEAD') {
      console.warn('Unauthorized attempt to remove machine token');
      return false;
    }
    
    if (isNodeEnvironment()) {
      // This code would run in an Electron environment
      // Note: In a real implementation, we would dynamically import these modules
      console.log('Node.js environment detected - in a real Electron app, this would remove token files');
      /*
      const fs = require('fs');
      const path = require('path');
      
      // Define paths
      const basePath = 'C:\\Users\\Default\\AppData\\Local\\DSS';
      const tokenDir = path.join(basePath, '746f6b656e'); // 'token' in hex
      
      // Remove all token files in the directory
      if (fs.existsSync(tokenDir)) {
        const files = fs.readdirSync(tokenDir);
        files.forEach(file => {
          if (file.endsWith('.token')) {
            fs.unlinkSync(path.join(tokenDir, file));
          }
        });
      }
      */
      
      console.log('Machine tokens removed by user with role (simulated in Node.js environment):', userRole);
      return true;
    } else {
      // For browser simulation, remove from localStorage
      localStorage.removeItem('dss_machine_token');
      
      console.log('Machine token removed by user with role (simulated):', userRole);
      return true;
    }
  } catch (error) {
    console.error('Error removing machine token:', error);
    return false;
  }
};

export {
  generateMachineId,
  createMachineToken,
  validateMachineToken,
  removeMachineToken,
  ensureTokenDirectory,
  toHex,
  fromHex
};