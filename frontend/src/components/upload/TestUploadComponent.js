import React, { useState } from 'react';
import useUploadManager from './useUploadManager';

const TestUploadComponent = ({ user }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // Mock folder data for testing
  const mockFolder = {
    id: 1,
    name: "Test Folder",
    owner: user.id
  };

  // Mock onUploadComplete function
  const handleUploadComplete = (result) => {
    setTestResults(prev => [...prev, {
      type: 'success',
      message: `Upload completed: ${result.successCount} successful, ${result.errorCount} errors`,
      timestamp: new Date().toISOString()
    }]);
  };

  // Mock onError function
  const handleError = (error) => {
    setTestResults(prev => [...prev, {
      type: 'error',
      message: `Upload error: ${error.message}`,
      timestamp: new Date().toISOString()
    }]);
  };

  // Initialize the upload manager hook
  const { handleFileUpload, handleCreateFolder } = useUploadManager(
    user,
    selectedFolder,
    handleUploadComplete,
    handleError
  );

  const runFileUploadTest = () => {
    console.log('[TEST COMPONENT] Running file upload test');
    setTestResults(prev => [...prev, {
      type: 'info',
      message: 'Starting file upload test...',
      timestamp: new Date().toISOString()
    }]);
    handleFileUpload();
  };

  const runFolderCreationTest = () => {
    console.log('[TEST COMPONENT] Running folder creation test');
    setTestResults(prev => [...prev, {
      type: 'info',
      message: 'Starting folder creation test...',
      timestamp: new Date().toISOString()
    }]);
    handleCreateFolder();
  };

  const setTestFolder = () => {
    setSelectedFolder(mockFolder);
    setTestResults(prev => [...prev, {
      type: 'info',
      message: `Test folder set: ${mockFolder.name} (ID: ${mockFolder.id})`,
      timestamp: new Date().toISOString()
    }]);
  };

  const clearTestFolder = () => {
    setSelectedFolder(null);
    setTestResults(prev => [...prev, {
      type: 'info',
      message: 'Test folder cleared',
      timestamp: new Date().toISOString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Upload Functionality Test</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Current Test State</h3>
        <p>Selected Folder: {selectedFolder ? `${selectedFolder.name} (ID: ${selectedFolder.id})` : 'None'}</p>
        <p>User: {user?.username || 'Not set'}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={runFileUploadTest}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test File Upload
        </button>
        
        <button 
          onClick={runFolderCreationTest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Folder Creation
        </button>
        
        <button 
          onClick={setTestFolder}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Set Test Folder
        </button>
        
        <button 
          onClick={clearTestFolder}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Clear Test Folder
        </button>
        
        <button 
          onClick={clearResults}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear Results
        </button>
      </div>

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

export default TestUploadComponent;