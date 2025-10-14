import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    backendStatus: 'Unknown',
    apiEndpoints: [],
    networkInfo: {}
  });
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    
    try {
      // Test direct connection to backend
      const backendResponse = await axios.get('http://localhost:8000/api/', {
        timeout: 5000
      });
      
      setDiagnostics(prev => ({
        ...prev,
        backendStatus: `✅ Connected (Status: ${backendResponse.status})`
      }));
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        backendStatus: `❌ Connection Failed (${error.message})`
      }));
    }
    
    // Test API endpoints
    const endpoints = [
      '/api/auth/me/',
      '/api/documents/',
      '/api/admin/dashboard/'
    ];
    
    const endpointResults = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:8000${endpoint}`, {
          timeout: 5000
        });
        endpointResults.push({
          endpoint,
          status: `✅ Success (${response.status})`,
          dataPreview: response.data ? JSON.stringify(response.data).substring(0, 100) + '...' : 'No data'
        });
      } catch (error) {
        endpointResults.push({
          endpoint,
          status: `❌ Failed (${error.response?.status || error.message})`,
          error: error.message
        });
      }
    }
    
    setDiagnostics(prev => ({
      ...prev,
      apiEndpoints: endpointResults
    }));
    
    setLoading(false);
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">API Diagnostics</h2>
      
      <button 
        onClick={testBackendConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 mb-4"
      >
        {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
      </button>
      
      <div className="space-y-4">
        <div className="border rounded p-3">
          <h3 className="font-medium">Backend Connection</h3>
          <p className={diagnostics.backendStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
            {diagnostics.backendStatus}
          </p>
        </div>
        
        <div className="border rounded p-3">
          <h3 className="font-medium mb-2">API Endpoints Test</h3>
          <div className="space-y-3">
            {diagnostics.apiEndpoints.map((endpoint, index) => (
              <div key={index} className="p-2 border rounded">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">{endpoint.endpoint}</span>
                  <span className={endpoint.status.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                    {endpoint.status}
                  </span>
                </div>
                {endpoint.error && (
                  <div className="text-sm text-red-600 mt-1">
                    Error: {endpoint.error}
                  </div>
                )}
                {endpoint.dataPreview && (
                  <div className="text-sm text-gray-600 mt-1">
                    Data: {endpoint.dataPreview}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="border rounded p-3">
          <h3 className="font-medium mb-2">Troubleshooting Steps</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Ensure the Django backend server is running on port 8000</li>
            <li>Check if the API endpoints are properly configured in your Django backend</li>
            <li>Verify that CORS settings allow requests from your frontend</li>
            <li>Check network connectivity between frontend and backend</li>
            <li>Review browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiDiagnostics;