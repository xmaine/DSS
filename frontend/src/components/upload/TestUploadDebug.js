import React, { useState } from 'react';
import { createDocument } from '../../services/api';
import { uploadFile } from '../../services/uploadService';

const TestUploadDebug = ({ user }) => {
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

  const testDirectApiCall = async () => {
    if (!user) {
      addResult('error', 'User not available. Cannot test file upload.');
      return;
    }
    
    setIsLoading(true);
    addResult('info', 'Testing direct API call with FormData...');
    
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
      addResult('error', `Direct API call test failed: ${error.message}`);
      console.error('Direct API call error:', error);
      
      // Log detailed error information
      if (error.response) {
        addResult('error', `Response status: ${error.response.status}`);
        addResult('error', `Response data: ${JSON.stringify(error.response.data)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testUploadService = async () => {
    if (!user) {
      addResult('error', 'User not available. Cannot test file upload.');
      return;
    }
    
    setIsLoading(true);
    addResult('info', 'Testing upload service...');
    
    try {
      // Create a simple text file for testing
      const fileContent = 'This is a test file for debugging upload service.';
      const file = new File([fileContent], 'debug-service-file.txt', { type: 'text/plain' });
      
      addResult('info', `Created test file: ${file.name} (${file.size} bytes)`);
      
      // Test the upload service
      addResult('info', 'Calling uploadFile service...');
      const response = await uploadFile(file, user, null);
      
      addResult('success', `Upload service successful!`);
      addResult('success', `Response status: ${response.status}`);
      addResult('success', `Document ID: ${response.data?.id}`);
      addResult('success', `Document title: ${response.data?.title}`);
      
    } catch (error) {
      addResult('error', `Upload service test failed: ${error.message}`);
      console.error('Upload service error:', error);
      
      // Log detailed error information
      if (error.response) {
        addResult('error', `Response status: ${error.response.status}`);
        addResult('error', `Response data: ${JSON.stringify(error.response.data)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testFormDataCreation = () => {
    addResult('info', 'Testing FormData creation...');
    
    try {
      // Create a simple text file for testing
      const fileContent = 'Test content';
      const file = new File([fileContent], 'test.txt', { type: 'text/plain' });
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', 'Test Document');
      formData.append('file', file);
      formData.append('uploader', '123');
      
      addResult('success', 'FormData created successfully');
      addResult('info', 'FormData contents:');
      
      for (let [key, value] of formData.entries()) {
        addResult('info', `  ${key}: ${value instanceof File ? `${value.name} (${value.size} bytes)` : value}`);
      }
      
      // Test if FormData is properly detected
      const isFormData = formData instanceof FormData;
      addResult('success', `FormData instance check: ${isFormData}`);
      
    } catch (error) {
      addResult('error', `FormData creation test failed: ${error.message}`);
      console.error('FormData creation error:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Upload Debug Test</h2>
      
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
          onClick={testDirectApiCall}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Direct API Call
        </button>
        
        <button 
          onClick={testUploadService}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Upload Service
        </button>
        
        <button 
          onClick={testFormDataCreation}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test FormData Creation
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
                  'bg-blue-100 border border-blue-300'
                }`}
              >
                <span className="text-xs text-gray-500 mr-2">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
                <span className={
                  result.type === 'error' ? 'text-red-700' : 
                  result.type === 'success' ? 'text-green-700' : 
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

export default TestUploadDebug;