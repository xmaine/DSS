import React, { useState } from 'react';
import { getFolders, getDocuments, createDocument, createFolder } from '../../services/api';

const UploadDebugPanel = ({ user, selectedFolder }) => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (type, message) => {
    setTestResults(prev => [...prev, {
      type,
      message,
      timestamp: new Date().toISOString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    addResult('info', 'Testing API connection...');
    
    try {
      // Test get folders
      addResult('info', 'Testing GET /folders/');
      const foldersResponse = await getFolders();
      addResult('success', `GET /folders/ successful. Found ${foldersResponse.data?.length || 0} folders.`);
      
      // Test get documents
      addResult('info', 'Testing GET /documents/');
      const documentsResponse = await getDocuments();
      addResult('success', `GET /documents/ successful. Found ${documentsResponse.data?.length || 0} documents.`);
      
    } catch (error) {
      addResult('error', `API connection test failed: ${error.message}`);
      console.error('API connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testFileUpload = async () => {
    if (!user) {
      addResult('error', 'User not available. Cannot test file upload.');
      return;
    }
    
    setIsLoading(true);
    addResult('info', 'Testing file upload with FormData...');
    
    try {
      // Create a simple text file for testing
      const fileContent = 'This is a test file for debugging upload functionality.';
      const file = new File([fileContent], 'debug-test-file.txt', { type: 'text/plain' });
      
      addResult('info', `Created test file: ${file.name} (${file.size} bytes)`);
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', 'Debug Test Document');
      formData.append('file', file);
      formData.append('original_filename', file.name);
      formData.append('file_size', file.size);
      formData.append('mime_type', file.type);
      formData.append('uploader', user.id);
      
      // If a folder is selected, associate the document with that folder
      if (selectedFolder) {
        formData.append('folder', selectedFolder.id);
        addResult('info', `Associating document with folder: ${selectedFolder.name} (ID: ${selectedFolder.id})`);
      }
      
      addResult('info', 'FormData created with the following fields:');
      for (let [key, value] of formData.entries()) {
        addResult('info', `  ${key}: ${value instanceof File ? value.name : value}`);
      }
      
      // Test the API call
      addResult('info', 'Calling POST /documents/ with FormData...');
      const response = await createDocument(formData);
      
      addResult('success', `POST /documents/ successful!`);
      addResult('success', `Response status: ${response.status}`);
      addResult('success', `Document ID: ${response.data?.id}`);
      addResult('success', `Document title: ${response.data?.title}`);
      
    } catch (error) {
      addResult('error', `File upload test failed: ${error.message}`);
      console.error('File upload error:', error);
      
      // Log detailed error information
      if (error.response) {
        addResult('error', `Response status: ${error.response.status}`);
        addResult('error', `Response data: ${JSON.stringify(error.response.data)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testFolderCreation = async () => {
    if (!user) {
      addResult('error', 'User not available. Cannot test folder creation.');
      return;
    }
    
    setIsLoading(true);
    addResult('info', 'Testing folder creation...');
    
    try {
      const folderData = {
        name: `Debug Test Folder ${Date.now()}`,
        owner: user.id,
        is_active: true
      };
      
      // If a folder is selected, set it as the parent
      if (selectedFolder) {
        folderData.parent_folder = selectedFolder.id;
        addResult('info', `Setting parent folder: ${selectedFolder.name} (ID: ${selectedFolder.id})`);
      }
      
      addResult('info', `Folder data to send: ${JSON.stringify(folderData)}`);
      
      const response = await createFolder(folderData);
      addResult('success', `POST /folders/ successful!`);
      addResult('success', `Response status: ${response.status}`);
      addResult('success', `Folder ID: ${response.data?.id}`);
      addResult('success', `Folder name: ${response.data?.name}`);
      
    } catch (error) {
      addResult('error', `Folder creation test failed: ${error.message}`);
      console.error('Folder creation error:', error);
      
      // Log detailed error information
      if (error.response) {
        addResult('error', `Response status: ${error.response.status}`);
        addResult('error', `Response data: ${JSON.stringify(error.response.data)}`);
        
        // Check for permission denied errors
        if (error.response.status === 403) {
          if (user && user.role === 'EMPLOYEE') {
            addResult('warning', 'Employees do not have permission to create folders. This is expected behavior.');
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testFormDataHandling = () => {
    addResult('info', 'Testing FormData handling...');
    
    try {
      // Create a simple text file for testing
      const fileContent = 'Test content';
      const file = new File([fileContent], 'test.txt', { type: 'text/plain' });
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', 'Test Document');
      formData.append('file', file);
      formData.append('uploader', user?.id || '123');
      
      addResult('success', 'FormData created successfully');
      addResult('info', 'FormData contents:');
      
      for (let [key, value] of formData.entries()) {
        addResult('info', `  ${key}: ${value instanceof File ? `${value.name} (${value.size} bytes)` : value}`);
      }
      
      // Test if FormData is properly detected
      const isFormData = formData instanceof FormData;
      addResult('success', `FormData instance check: ${isFormData}`);
      
    } catch (error) {
      addResult('error', `FormData handling test failed: ${error.message}`);
      console.error('FormData handling error:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mt-4">
      <h2 className="text-xl font-bold mb-4">Upload Debug Panel</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Current State</h3>
        {user ? (
          <div>
            <p>User: {user.username} ({user.role})</p>
            <p>User ID: {user.id}</p>
          </div>
        ) : (
          <p className="text-red-500">No user information available</p>
        )}
        {selectedFolder ? (
          <div className="mt-2">
            <p>Selected Folder: {selectedFolder.name}</p>
            <p>Folder ID: {selectedFolder.id}</p>
          </div>
        ) : (
          <p className="text-yellow-500 mt-2">No folder selected</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={testApiConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test API Connection
        </button>
        
        <button 
          onClick={testFileUpload}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test File Upload
        </button>
        
        <button 
          onClick={testFolderCreation}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test Folder Creation
        </button>
        
        <button 
          onClick={testFormDataHandling}
          disabled={isLoading}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          Test FormData Handling
        </button>
        
        <button 
          onClick={clearResults}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear Results
        </button>
      </div>

      {isLoading && (
        <div className="mb-4 p-2 bg-blue-100 rounded">
          <p>Test in progress...</p>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Test Results</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No test results yet. Run a test to see results here.</p>
        ) : (
          <div className="bg-white p-3 rounded border max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-2 mb-2 rounded ${
                  result.type === 'error' ? 'bg-red-100 border border-red-300' :
                  result.type === 'success' ? 'bg-green-100 border border-green-300' :
                  result.type === 'warning' ? 'bg-yellow-100 border border-yellow-300' :
                  'bg-blue-100 border border-blue-300'
                }`}
              >
                <span className="text-xs text-gray-500 mr-2">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
                <span className={
                  result.type === 'error' ? 'text-red-700' : 
                  result.type === 'success' ? 'text-green-700' : 
                  result.type === 'warning' ? 'text-yellow-700' : 
                  'text-blue-700'
                }>
                  {result.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDebugPanel;