import React, { useState, useEffect } from 'react';
import DocumentTable from '../ui/DocumentTable';
import { getDocuments, searchDocuments, getTags } from '../../services/api';
import { getAdminFolderTree, getAdminCorrespondents } from '../../services/adminApi';
import { FolderIcon } from '../ui/Icons';

const DocumentsPage = ({ isAdminView = false }) => {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [correspondents, setCorrespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCorrespondent, setSelectedCorrespondent] = useState('');

  // In a real implementation, this would fetch from your Django API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tags and correspondents for filters
        const [tagsResponse, correspondentsResponse] = await Promise.all([
          getTags(),
          isAdminView ? getAdminCorrespondents() : Promise.resolve({ data: [] })
        ]);
        
        setTags(tagsResponse.data);
        if (isAdminView) {
          setCorrespondents(correspondentsResponse.data);
        }
        
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

  const handleTagFilterChange = (e) => {
    setSelectedTag(e.target.value);
    // In a real implementation, this would filter the documents
    console.log('Filtering by tag:', e.target.value);
  };

  const handleCorrespondentFilterChange = (e) => {
    setSelectedCorrespondent(e.target.value);
    // In a real implementation, this would filter the documents
    console.log('Filtering by correspondent:', e.target.value);
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
            <select 
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={selectedTag}
              onChange={handleTagFilterChange}
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Correspondent</label>
            <select 
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={selectedCorrespondent}
              onChange={handleCorrespondentFilterChange}
              disabled={!isAdminView}
            >
              <option value="">All Correspondents</option>
              {correspondents.map(correspondent => (
                <option key={correspondent.id} value={correspondent.name}>{correspondent.name}</option>
              ))}
            </select>
            {!isAdminView && (
              <p className="text-xs text-gray-500 mt-1">Correspondent filtering available for Admin only</p>
            )}
          </div>
        </div>
        
        {isAdminView && folders.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Department Folders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <div 
                  key={folder.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <FolderIcon className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium text-gray-800">{folder.name || 'Unnamed Folder'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click to view documents in this folder</p>
                </div>
              ))}
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