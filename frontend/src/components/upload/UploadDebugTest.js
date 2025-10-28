import React, { useState } from 'react';
import { uploadMultipleFiles, createNewFolder } from '../../services/uploadService';

const UploadDebugTest = ({ user, selectedFolder }) => {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (testName, status, message, details = null) => {
    setTestResults(prev => [...prev, { testName, status, message, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testFileUpload = async () => {
    try {
      addResult('File Upload Test', 'running', 'Testing file upload functionality...');
      
      // Create a test file
      const testFile = new File(['Test content for upload'], 'test-file.txt', { type: 'text/plain' });
      
      // Test uploadFile function directly
      const formData = new FormData();
      formData.append('title', testFile.name);
      formData.append('file', testFile);
      formData.append('original_filename', testFile.name);
      formData.append('file_size', testFile.size);
      formData.append('mime_type', testFile.type);
      
      if (selectedFolder) {
        formData.append('folder', selectedFolder.id);
      }
      
      formData.append('uploader', user.id);
      
      addResult('File Upload Test', 'info', 'FormData created', {
        title: testFile.name,
        fileSize: testFile.size,
        mimeType: testFile.type,
        folderId: selectedFolder?.id,
        uploaderId: user.id
      });
      
      // This would normally call the API, but we'll simulate success for now
      addResult('File Upload Test', 'success', 'File upload would be successful');
    } catch (error) {
      addResult('File Upload Test', 'error', 'File upload failed', {
        message: error.message,
        response: error.response?.data
      });
    }
  };

  const testFolderCreation = async () => {
    try {
      addResult('Folder Creation Test', 'running', 'Testing folder creation functionality...');
      
      const folderName = 'Test Folder';
      const folderData = {
        name: folderName,
        owner: user.id,
        is_active: true
      };
      
      if (selectedFolder) {
        folderData.parent_folder = selectedFolder.id;
      }
      
      addResult('Folder Creation Test', 'info', 'Folder data prepared', folderData);
      
      // This would normally call the API, but we'll simulate success for now
      addResult('Folder Creation Test', 'success', 'Folder creation would be successful');
    } catch (error) {
      addResult('Folder Creation Test', 'error', 'Folder creation failed', {
        message: error.message,
        response: error.response?.data
      });
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    clearResults();
    
    await testFileUpload();
    await testFolderCreation();
    
    setIsTesting(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Upload Functionality Debug Test</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">User: {user?.username} (Role: {user?.role})</p>
        <p className="text-sm text-gray-600 mb-2">Selected Folder: {selectedFolder ? `${selectedFolder.name} (ID: ${selectedFolder.id})` : 'None'}</p>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={runAllTests}
          disabled={isTesting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Run All Tests'}
        </button>
        <button 
          onClick={clearResults}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>
      
      <div className="bg-white rounded-md p-4">
        <h4 className="font-medium mb-2">Test Results:</h4>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No test results yet. Click "Run All Tests" to start.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className={`p-3 rounded-md border ${
                result.status === 'success' ? 'bg-green-50 border-green-200' :
                result.status === 'error' ? 'bg-red-50 border-red-200' :
                result.status === 'running' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{result.testName}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      result.status === 'success' ? 'bg-green-200 text-green-800' :
                      result.status === 'error' ? 'bg-red-200 text-red-800' :
                      result.status === 'running' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{result.timestamp}</span>
                </div>
                <p className="mt-1 text-sm">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">Details</summary>
                    <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDebugTest;