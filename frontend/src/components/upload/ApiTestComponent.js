import React, { useState } from 'react';
import { getFolders, getDocuments, createFolder, createDocument } from '../../services/api';

const ApiTestComponent = ({ user }) => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (type, message) => {
    setTestResults(prev => [...prev, {
      type,
      message,
      timestamp: new Date().toISOString()
    }]);
  };

  const testGetFolders = async () => {
    setIsLoading(true);
    addResult('info', 'Testing GET /folders/');
    
    try {
      const response = await getFolders();
      addResult('success', `GET /folders/ successful. Found ${response.data?.length || 0} folders.`);
      console.log('Folders response:', response);
    } catch (error) {
      addResult('error', `GET /folders/ failed: ${error.message}`);
      console.error('Folders error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetDocuments = async () => {
    setIsLoading(true);
    addResult('info', 'Testing GET /documents/');
    
    try {
      const response = await getDocuments();
      addResult('success', `GET /documents/ successful. Found ${response.data?.length || 0} documents.`);
      console.log('Documents response:', response);
    } catch (error) {
      addResult('error', `GET /documents/ failed: ${error.message}`);
      console.error('Documents error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateFolder = async () => {
    if (!user) {
      addResult('error', 'User not available. Cannot create folder.');
      return;
    }
    
    setIsLoading(true);
    addResult('info', 'Testing POST /folders/');
    
    try {
      const folderData = {
        name: `Test Folder ${Date.now()}`,
        owner: user.id,
        is_active: true
      };
      
      const response = await createFolder(folderData);
      addResult('success', `POST /folders/ successful. Created folder: ${response.data?.name}`);
      console.log('Create folder response:', response);
    } catch (error) {
      addResult('error', `POST /folders/ failed: ${error.message}`);
      console.error('Create folder error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateDocument = async () => {
    if (!user) {
      addResult('error', 'User not available. Cannot create document.');
      return;
    }
    
    setIsLoading(true);
    addResult('info', 'Testing POST /documents/ with FormData');
    
    try {
      // Create a simple text file for testing
      const fileContent = 'This is a test file for upload functionality.';
      const file = new File([fileContent], 'test-file.txt', { type: 'text/plain' });
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', 'Test Document');
      formData.append('file', file);
      formData.append('original_filename', file.name);
      formData.append('file_size', file.size);
      formData.append('mime_type', file.type);
      formData.append('uploader', user.id);
      
      const response = await createDocument(formData);
      addResult('success', `POST /documents/ successful. Created document: ${response.data?.title}`);
      console.log('Create document response:', response);
    } catch (error) {
      addResult('error', `POST /documents/ failed: ${error.message}`);
      console.error('Create document error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">API Test Component</h2>
      
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
          onClick={testCreateFolder}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test Create Folder
        </button>
        
        <button 
          onClick={testCreateDocument}
          disabled={isLoading}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          Test Create Document
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
          <p>Testing in progress...</p>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Test Results</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No test results yet. Run a test to see results here.</p>
        ) : (
          <div className="bg-white p-3 rounded border max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-2 mb-2 rounded ${
                  result.type === 'error' ? 'bg-red-100 border border-red-300' :
                  result.type === 'success' ? 'bg-green-100 border border-green-300' :
                  'bg-blue-100 border border-blue-300'
                }`}
              >
                <span className="text-xs text-gray-500 mr-2">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
                <span className={result.type === 'error' ? 'text-red-700' : 
                                result.type === 'success' ? 'text-green-700' : 
                                'text-blue-700'}>
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

export default ApiTestComponent;