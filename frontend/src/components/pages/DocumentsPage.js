import React, { useState, useEffect } from 'react';
import DocumentTable from '../ui/DocumentTable';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // In a real implementation, this would fetch from your Django API
  useEffect(() => {
    // Simulate API call
    const fetchDocuments = async () => {
      try {
        // This is mock data - replace with actual API call
        const mockData = [
          { 
            id: 1, 
            title: 'Annual Report 2025', 
            uploaded_at: '2025-10-01T10:30:00Z',
            tags: ['Finance', 'Annual'],
            correspondent: 'Finance Department'
          },
          { 
            id: 2, 
            title: 'Project Proposal', 
            uploaded_at: '2025-09-28T14:15:00Z',
            tags: ['Project', 'Proposal'],
            correspondent: 'Project Management'
          },
          { 
            id: 3, 
            title: 'Employee Handbook', 
            uploaded_at: '2025-09-25T09:45:00Z',
            tags: ['HR', 'Policy'],
            correspondent: 'Human Resources'
          }
        ];
        
        setDocuments(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load documents');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDocumentClick = (document) => {
    console.log('Viewing document:', document);
    // In a real implementation, this would navigate to the document detail page
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
        <h2 className="text-xl font-semibold text-gray-800">All Documents</h2>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Upload Document
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 mb-4">
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