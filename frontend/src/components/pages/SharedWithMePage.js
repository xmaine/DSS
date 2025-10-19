import React, { useState, useEffect } from 'react';
import DocumentTable from '../ui/DocumentTable';
import { getDocuments } from '../../services/api';

const SharedWithMePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedDocuments = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would filter documents shared with the current user
        const response = await getDocuments();
        
        // Process documents to match the expected format
        const processedDocuments = response.data.map(doc => ({
          id: doc.id,
          created: new Date(doc.created_at).toLocaleDateString(),
          title: doc.name,
          tags: doc.tags || [],
          correspondent: doc.correspondent_name || 'Unknown',
          sharedBy: doc.uploader_name || 'Unknown'
        }));
        
        setDocuments(processedDocuments);
        setError(null);
      } catch (err) {
        console.error('Error fetching shared documents:', err);
        setError('Failed to fetch shared documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDocuments();
  }, []);

  const handleDocumentClick = (document) => {
    console.log('Viewing shared document:', document);
    // In a real app, this would navigate to the document detail page
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p>Loading shared documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Shared With Me</h2>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Shared Documents</option>
            <option>Shared by Me</option>
            <option>Recently Shared</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
            Share Document
          </button>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">About Shared Documents</h3>
        <p className="text-sm text-gray-600">
          These are documents that other users have shared with you. You can view, download, and in some cases edit these documents based on the permissions granted by the sharer.
        </p>
      </div>
      
      <DocumentTable 
        title="Shared Documents" 
        data={documents} 
        onDocumentClick={handleDocumentClick} 
      />
    </div>
  );
};

export default SharedWithMePage;