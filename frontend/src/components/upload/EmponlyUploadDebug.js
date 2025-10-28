import React, { useState } from 'react';
import { getFolders, getDocuments, createDocument } from '../../services/api';

const EmponlyUploadDebug = ({ user }) => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);

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

  const testGetFolders = async () => {
    if (!user) {
      addResult('error', 'User not available. Cannot test folder retrieval.');
      return;
    }
    
    setIsLoading(true);
    addResult('info', 'Testing GET /folders/ for emponly user...');
    
    try {
      const response = await getFolders();
      setFolders(response.data || []);
      addResult('success', `GET /folders/ successful. Found ${response.data?.length || 0} folders.`);
      console.log('Folders response:', response);
      
      // Log folder details
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(folder => {
          addResult('info', `Folder: ${folder.name} (ID: ${folder.id}, Owner: ${typeof folder.owner === 'object' ? folder.owner.username : folder.owner})`);
        });
      }
    } catch (error) {
      addResult('error', `GET /folders/ failed: ${error.message}`);
      console.error('Folders error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetDocuments = async () => {
    if (!user) {
      addResult('error', 'User not available. Cannot test document retrieval.');
      return;
    }
    
    setIsLoading(true);
    addResult('info', 'Testing GET /documents/ for emponly user...');
    
    try {
      const response = await getDocuments();
      setDocuments(response.data || []);
      addResult('success', `GET /documents/ successful. Found ${response.data?.length || 0} documents.`);
      console.log('Documents response:', response);
    } catch (error) {
      addResult('error', `GET /documents/ failed: ${error.message}`);
      console.error('Documents error:', error);
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
    addResult('info', 'Testing file upload with FormData for emponly user...');
    
    try {
      // Create a simple text file for testing
      const fileContent = 'This is a test file for debugging upload functionality for emponly user.';
      const file = new File([fileContent], 'emponly-test-file.txt', { type: 'text/plain' });
      
      addResult('info', `Created test file: ${file.name} (${file.size} bytes)`);
      
      // Get user's folders first
      addResult('info', 'Fetching user folders...');
      const foldersResponse = await getFolders();
      const userFolders = foldersResponse.data?.filter(folder => {
        const isOwnedByUser = (typeof folder.owner === 'object' && folder.owner !== null) 
          ? folder.owner.id === user.id 
          : folder.owner === user.id;
        return isOwnedByUser;
      }) || [];
      
      addResult('info', `Found ${userFolders.length} folders owned by user`);
      
      // Select a folder for upload (prefer home folder)
      let selectedFolder = null;
      if (userFolders.length > 0) {
        selectedFolder = userFolders.find(f => f.name && f.name.includes("'s Documents")) || userFolders[0];
        addResult('info', `Selected folder: ${selectedFolder.name} (ID: ${selectedFolder.id})`);
      } else {
        addResult('warning', 'No folders found for user, uploading without folder association');
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', 'Emponly Test Document');
      formData.append('file', file);
      formData.append('original_filename', file.name);
      formData.append('file_size', file.size);
      formData.append('mime_type', file.type);
      formData.append('uploader', user.id);
      
      if (selectedFolder) {
        formData.append('folder', selectedFolder.id);
        addResult('info', `Associating document with folder: ${selectedFolder.name}`);
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

  const testFormDataHandling = () => {
    addResult('info', 'Testing FormData handling...');
    
    try {
      // Create a simple text file for testing
      const fileContent = 'Test content for emponly';
      const file = new File([fileContent], 'emponly-test.txt', { type: 'text/plain' });
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', 'Emponly Test Document');
      formData.append('file', file);
      formData.append('uploader', '4'); // emponly user ID
      
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
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Emponly Upload Debug Test</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">User Information</h3>
        {user ? (
          <div>
            <p>Username: {user.username}</p>
            <p>Role: {user.role}</p>
            <p>User ID: {user.id}</p>
          </div>
        ) : (
          <p className="text-red-500">No user information available</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={testGetFolders}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Get Folders
        </button>
        
        <button 
          onClick={testGetDocuments}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Get Documents
        </button>
        
        <button 
          onClick={testFileUpload}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test File Upload
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

export default EmponlyUploadDebug;