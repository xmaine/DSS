/**
 * Test script for DSS directory setup
 * This script can be run with Node.js to test the directory creation
 */

const fs = require('fs');
const path = require('path');

// Function to create DSS directory structure
function createDSSDirectory() {
  try {
    // Define the base path
    const basePath = 'C:\\Users\\Default\\AppData\\Local\\DSS';
    
    console.log('Creating DSS directory structure...');
    console.log('Base path:', basePath);
    
    // Create the base directory if it doesn't exist
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
      console.log('Created base directory:', basePath);
    } else {
      console.log('Base directory already exists:', basePath);
    }
    
    // Create the token directory (hex: 'token')
    const tokenPath = path.join(basePath, '746f6b656e'); // 'token' in hex
    if (!fs.existsSync(tokenPath)) {
      fs.mkdirSync(tokenPath, { recursive: true });
      console.log('Created token directory:', tokenPath);
    } else {
      console.log('Token directory already exists:', tokenPath);
    }
    
    // Create the user directory (hex: 'directory')
    const userPath = path.join(basePath, '6469726563746f7279'); // 'directory' in hex
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, { recursive: true });
      console.log('Created user directory:', userPath);
    } else {
      console.log('User directory already exists:', userPath);
    }
    
    console.log('\nDSS directory structure created successfully!');
    console.log('Structure:');
    console.log(`${basePath}`);
    console.log(`├── 746f6b656e (token directory)`);
    console.log(`└── 6469726563746f7279 (user directory)`);
    
    return true;
  } catch (error) {
    console.error('Error creating DSS directory structure:', error);
    return false;
  }
}

// Function to create a test token
function createTestToken(username = 'emponly', machineId = 'test-machine-123') {
  try {
    const basePath = 'C:\\Users\\Default\\AppData\\Local\\DSS';
    const tokenDir = path.join(basePath, '746f6b656e'); // 'token' in hex
    
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
    fs.writeFileSync(tokenPath, JSON.stringify(tokenData, null, 2), 'utf8');
    console.log('Created test token:', tokenPath);
    
    // Also create a user directory with hex-encoded username
    const userDir = path.join(basePath, '6469726563746f7279'); // 'directory' in hex
    const hexUsername = Array.from(username).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    const userDirPath = path.join(userDir, hexUsername);
    if (!fs.existsSync(userDirPath)) {
      fs.mkdirSync(userDirPath, { recursive: true });
      console.log('Created user directory:', userDirPath);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating test token:', error);
    return false;
  }
}

// Function to list existing tokens
function listTokens() {
  try {
    const basePath = 'C:\\Users\\Default\\AppData\\Local\\DSS';
    const tokenDir = path.join(basePath, '746f6b656e'); // 'token' in hex
    
    if (!fs.existsSync(tokenDir)) {
      console.log('Token directory does not exist:', tokenDir);
      return;
    }
    
    const files = fs.readdirSync(tokenDir);
    const tokenFiles = files.filter(file => file.endsWith('.token'));
    
    console.log('\nExisting tokens:');
    if (tokenFiles.length === 0) {
      console.log('No tokens found.');
    } else {
      tokenFiles.forEach(file => {
        const filePath = path.join(tokenDir, file);
        const tokenData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`- ${file}:`);
        console.log(`  Username: ${tokenData.username}`);
        console.log(`  Machine ID: ${tokenData.machineId}`);
        console.log(`  Created: ${tokenData.createdAt}`);
        console.log(`  Expires: ${tokenData.expiresAt}`);
      });
    }
  } catch (error) {
    console.error('Error listing tokens:', error);
  }
}

// Main execution
console.log('DSS Directory Setup Test Script');
console.log('================================');

// Create directory structure
if (createDSSDirectory()) {
  console.log('\nCreating test token...');
  if (createTestToken()) {
    listTokens();
  }
}

console.log('\nTest completed!');