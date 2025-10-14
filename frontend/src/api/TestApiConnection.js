import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';
import { getAdminDashboard, getAdminUsers, getAdminDocumentTypes, getAdminCorrespondents } from '../services/adminApi';

const TestApiConnection = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runApiTests = async () => {
    setLoading(true);
    const results = [];
    
    try {
      // Test 1: Current user
      results.push({ test: 'Get Current User', status: 'Running...' });
      setTestResults([...results]);
      
      const userResponse = await getCurrentUser();
      results[0] = { 
        test: 'Get Current User', 
        status: userResponse.status === 200 ? '✅ Success' : '❌ Failed',
        details: userResponse.status === 200 ? `User: ${userResponse.data?.data?.username}` : `Status: ${userResponse.status}`
      };
      setTestResults([...results]);
      
      // Test 2: Admin Dashboard
      results.push({ test: 'Admin Dashboard', status: 'Running...' });
      setTestResults([...results]);
      
      const dashboardResponse = await getAdminDashboard();
      results[1] = { 
        test: 'Admin Dashboard', 
        status: dashboardResponse.status === 200 ? '✅ Success' : '❌ Failed',
        details: dashboardResponse.status === 200 ? `Keys: ${Object.keys(dashboardResponse.data).join(', ')}` : `Status: ${dashboardResponse.status}`
      };
      setTestResults([...results]);
      
      // Test 3: Admin Users
      results.push({ test: 'Admin Users', status: 'Running...' });
      setTestResults([...results]);
      
      const usersResponse = await getAdminUsers();
      results[2] = { 
        test: 'Admin Users', 
        status: usersResponse.status === 200 ? '✅ Success' : '❌ Failed',
        details: usersResponse.status === 200 ? `Users: ${usersResponse.data.length}` : `Status: ${usersResponse.status}`
      };
      setTestResults([...results]);
      
      // Test 4: Document Types
      results.push({ test: 'Document Types', status: 'Running...' });
      setTestResults([...results]);
      
      const docTypesResponse = await getAdminDocumentTypes();
      results[3] = { 
        test: 'Document Types', 
        status: docTypesResponse.status === 200 ? '✅ Success' : '❌ Failed',
        details: docTypesResponse.status === 200 ? `Types: ${docTypesResponse.data.length}` : `Status: ${docTypesResponse.status}`
      };
      setTestResults([...results]);
      
      // Test 5: Correspondents
      results.push({ test: 'Correspondents', status: 'Running...' });
      setTestResults([...results]);
      
      const correspondentsResponse = await getAdminCorrespondents();
      results[4] = { 
        test: 'Correspondents', 
        status: correspondentsResponse.status === 200 ? '✅ Success' : '❌ Failed',
        details: correspondentsResponse.status === 200 ? `Correspondents: ${correspondentsResponse.data.length}` : `Status: ${correspondentsResponse.status}`
      };
      setTestResults([...results]);
      
    } catch (error) {
      console.error('API Test Error:', error);
      results.push({ 
        test: 'Error', 
        status: '❌ Failed', 
        details: error.message || 'Unknown error occurred' 
      });
      setTestResults([...results]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run tests when component mounts
    runApiTests();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
      
      <button 
        onClick={runApiTests}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 mb-4"
      >
        {loading ? 'Testing...' : 'Run API Tests'}
      </button>
      
      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div key={index} className="p-3 border rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium">{result.test}:</span>
              <span className={result.status.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                {result.status}
              </span>
            </div>
            {result.details && (
              <div className="text-sm text-gray-600 mt-1">
                {result.details}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {testResults.length > 0 && testResults.every(r => r.status.includes('✅')) && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          ✅ All API tests passed! The System Administrator components should now work correctly.
        </div>
      )}
      
      {testResults.length > 0 && testResults.some(r => r.status.includes('❌')) && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          ❌ Some API tests failed. Check the backend server and network connectivity.
        </div>
      )}
    </div>
  );
};

export default TestApiConnection;