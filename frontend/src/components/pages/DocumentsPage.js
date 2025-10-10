import React, { useState, useEffect } from 'react';
import DocumentTable from '../ui/DocumentTable';
import { getDocuments, searchDocuments } from '../../services/api';
import { getAdminFolderTree } from '../../services/adminApi';

const DocumentsPage = ({ isAdminView = false }) => {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // In a real implementation, this would fetch from your Django API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isAdminView) {
          // For System Administrator, fetch all documents and folder tree
          const [docsResponse, foldersResponse] = await Promise.all([
            getDocuments(),
            getAdminFolderTree()
          ]);
          
          setDocuments(docsResponse.data);
          setFolders(foldersResponse.data);
        } else {
          // For regular users, fetch their documents
          const response = await getDocuments();
          setDocuments(response.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load documents');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdminView]);

  const handleDocumentClick = (document) => {
    console.log('Viewing document:', document);
    // In a real implementation, this would navigate to the document detail page
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await searchDocuments(searchQuery);
      setDocuments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to search documents');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p>Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {isAdminView ? 'All Documents' : 'My Documents'}
        </h2>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Upload Document
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Documents</label>
            <div className="flex">
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-l-md shadow-sm p-2"
                placeholder="Enter search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Tag</label>
            <select className="block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option>All Tags</option>
              <option>Finance</option>
              <option>Project</option>
              <option>HR</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Correspondent</label>
            <select className="block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option>All Correspondents</option>
              <option>Finance Department</option>
              <option>Project Management</option>
              <option>Human Resources</option>
            </select>
          </div>
        </div>
        
        {isAdminView && folders.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Folder Tree</h3>
            <div className="border border-gray-200 rounded p-2">
              <ul className="text-sm">
                {folders.map((folder, index) => (
                  <li key={index} className="py-1">
                    <span className="ml-2">📁 {folder.name || 'Root'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <DocumentTable 
        title="Documents" 
        data={documents} 
        onDocumentClick={handleDocumentClick} 
      />
    </div>
  );
};

export default DocumentsPage;