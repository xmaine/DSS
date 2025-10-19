import React, { useState, useEffect } from 'react';
import { getFolders } from '../../services/api';

const FolderDiagnostics = () => {
  const [folderData, setFolderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testFolderAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing folder API endpoint...');
      const response = await getFolders();
      console.log('Folder API Response:', response);
      setFolderData(response);
    } catch (err) {
      console.error('Folder API Error:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testFolderAPI();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Folder API Diagnostics</h2>
      
      <button 
        onClick={testFolderAPI}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Folder API'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <pre>{error}</pre>
        </div>
      )}

      {folderData && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          <h3 className="font-bold">Success:</h3>
          <p>Status: {folderData.status}</p>
          <p>Data Length: {folderData.data?.length || 0}</p>
          <details>
            <summary className="cursor-pointer">View Full Response</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-60">
              {JSON.stringify(folderData, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>This diagnostic tool tests the folder API endpoint to identify any issues with folder data retrieval.</p>
      </div>
    </div>
  );
};

export default FolderDiagnostics;