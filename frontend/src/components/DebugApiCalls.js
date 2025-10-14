import React, { useState, useEffect } from 'react';
import { getAdminUsers, getAdminDocumentTypes, getAdminCorrespondents, getAdminDashboard } from '../services/adminApi';

const DebugApiCalls = () => {
  const [debugInfo, setDebugInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const testApiCalls = async () => {
    setLoading(true);
    const results = [];
    
    // Test 1: Dashboard
    try {
      results.push({ endpoint: 'Dashboard', status: 'Calling...', data: null, error: null });
      setDebugInfo([...results]);
      
      const dashboardResponse = await getAdminDashboard();
      results[0] = { 
        endpoint: 'Dashboard', 
        status: `Success (${dashboardResponse.status})`, 
        data: dashboardResponse.data,
        error: null 
      };
      setDebugInfo([...results]);
    } catch (error) {
      results[0] = { 
        endpoint: 'Dashboard', 
        status: `Error (${error.response?.status || 'Network Error'})`, 
        data: null,
        error: error.message 
      };
      setDebugInfo([...results]);
    }
    
    // Test 2: Users
    try {
      results.push({ endpoint: 'Users', status: 'Calling...', data: null, error: null });
      setDebugInfo([...results]);
      
      const usersResponse = await getAdminUsers();
      results[1] = { 
        endpoint: 'Users', 
        status: `Success (${usersResponse.status})`, 
        data: usersResponse.data,
        error: null 
      };
      setDebugInfo([...results]);
    } catch (error) {
      results[1] = { 
        endpoint: 'Users', 
        status: `Error (${error.response?.status || 'Network Error'})`, 
        data: null,
        error: error.message 
      };
      setDebugInfo([...results]);
    }
    
    // Test 3: Document Types
    try {
      results.push({ endpoint: 'Document Types', status: 'Calling...', data: null, error: null });
      setDebugInfo([...results]);
      
      const docTypesResponse = await getAdminDocumentTypes();
      results[2] = { 
        endpoint: 'Document Types', 
        status: `Success (${docTypesResponse.status})`, 
        data: docTypesResponse.data,
        error: null 
      };
      setDebugInfo([...results]);
    } catch (error) {
      results[2] = { 
        endpoint: 'Document Types', 
        status: `Error (${error.response?.status || 'Network Error'})`, 
        data: null,
        error: error.message 
      };
      setDebugInfo([...results]);
    }
    
    // Test 4: Correspondents
    try {
      results.push({ endpoint: 'Correspondents', status: 'Calling...', data: null, error: null });
      setDebugInfo([...results]);
      
      const correspondentsResponse = await getAdminCorrespondents();
      results[3] = { 
        endpoint: 'Correspondents', 
        status: `Success (${correspondentsResponse.status})`, 
        data: correspondentsResponse.data,
        error: null 
      };
      setDebugInfo([...results]);
    } catch (error) {
      results[3] = { 
        endpoint: 'Correspondents', 
        status: `Error (${error.response?.status || 'Network Error'})`, 
        data: null,
        error: error.message 
      };
      setDebugInfo([...results]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    testApiCalls();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">API Debug Information</h2>
      
      <button 
        onClick={testApiCalls}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 mb-4"
      >
        {loading ? 'Testing API Calls...' : 'Re-run API Tests'}
      </button>
      
      <div className="space-y-4">
        {debugInfo.map((info, index) => (
          <div key={index} className="border rounded p-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{info.endpoint}</h3>
              <span className={info.status.includes('Success') ? 'text-green-600' : 'text-red-600'}>
                {info.status}
              </span>
            </div>
            
            {info.error && (
              <div className="mt-2 text-sm text-red-600">
                <strong>Error:</strong> {info.error}
              </div>
            )}
            
            {info.data && (
              <div className="mt-2 text-sm">
                <strong>Data Preview:</strong>
                <pre className="bg-gray-100 p-2 mt-1 rounded overflow-x-auto text-xs">
                  {JSON.stringify(info.data, null, 2).substring(0, 500)}...
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugApiCalls;