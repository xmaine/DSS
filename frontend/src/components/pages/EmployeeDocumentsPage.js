import React, { useState, useEffect } from 'react';
import { 
  FolderIcon, 
  DocumentIcon, 
  UploadIcon, 
  SearchIcon, 
  LockIcon, 
  EditIcon, 
  DeleteIcon, 
  ViewIcon 
} from '../ui/Icons';
import { getFolders, getDocuments } from '../../services/api';

const EmployeeDocumentsPage = ({ onDocumentSelect, user }) => {
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]); // For multiple selection
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch folders and documents from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        
        // Fetch folders
        console.log('Fetching folders from API...');
        const foldersResponse = await getFolders();
        console.log('Folders API response:', foldersResponse);
        
        // Fetch documents
        console.log('Fetching documents from API...');
        const documentsResponse = await getDocuments();
        console.log('Documents API response:', documentsResponse);
        
        // Process folders
        if (foldersResponse.data && Array.isArray(foldersResponse.data)) {
          setFolders(foldersResponse.data);
          console.log('Folders state updated with', foldersResponse.data.length, 'folders');
          
          // Expand the first level folders by default
          const topLevelFolders = foldersResponse.data.filter(folder => folder.parent_folder === null);
          console.log('Top level folders:', topLevelFolders);
          setExpandedFolders(new Set(topLevelFolders.map(folder => folder.id)));
          console.log('Expanded folders set to:', Array.from(new Set(topLevelFolders.map(folder => folder.id))));
        } else {
          console.warn('Unexpected folder data format:', foldersResponse.data);
          setFolders([]);
        }
        
        // Process documents
        if (documentsResponse.data && Array.isArray(documentsResponse.data)) {
          // Convert API document data to the format expected by the UI
          const processedDocuments = documentsResponse.data.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.file_type || 'Unknown',
            uploader: doc.uploader_name || doc.uploader || 'Unknown User',
            lastModified: new Date(doc.updated_at || doc.created_at).toLocaleDateString(),
            version: doc.current_version_number || '1.0',
            lockedBy: doc.locked_by_name || null,
            tags: doc.tags || [],
            folder: doc.folder // Include folder ID for filtering
          }));
          
          setDocuments(processedDocuments);
          console.log('Documents state updated with', processedDocuments.length, 'documents');
        } else {
          console.warn('Unexpected document data format:', documentsResponse.data);
          setDocuments([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });
        setError('Failed to load data: ' + (err.response?.data?.detail || err.message || 'Unknown error'));
        setFolders([]);
        setDocuments([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const selectFolder = (folder) => {
    setSelectedFolder(folder);
    // Clear document selection when folder is selected
    setSelectedDocuments([]);
    if (onDocumentSelect) onDocumentSelect(null);
  };

  // Function to handle single document selection
  const selectDocument = (document) => {
    // For single selection, we'll just select one document
    const newSelected = [document];
    setSelectedDocuments(newSelected);
    if (onDocumentSelect) onDocumentSelect(document);
  };

  // Function to handle multiple document selection
  const toggleDocumentSelection = (documentId) => {
    setSelectedDocuments(prev => {
      if (prev.some(doc => doc.id === documentId)) {
        // If already selected, remove it
        return prev.filter(doc => doc.id !== documentId);
      } else {
        // If not selected, add it
        const docToAdd = documents.find(doc => doc.id === documentId);
        return [...prev, docToAdd];
      }
    });
  };

  // Function to select all documents
  const selectAllDocuments = () => {
    if (selectedDocuments.length === documents.length && documents.length > 0) {
      // If all are selected, deselect all
      setSelectedDocuments([]);
    } else {
      // If not all are selected, select all
      setSelectedDocuments([...documents]);
    }
  };

  const renderFolderTree = (parentId = null, level = 0) => {
    console.log(`Rendering folder tree for parentId=${parentId}, level=${level}`);
    console.log(`Current folders state:`, folders);
    console.log(`Current expanded folders:`, Array.from(expandedFolders));
    console.log(`Current user:`, user);
    
    // Show loading state
    if (loading) {
      console.log('Showing loading state');
      return <div className="p-2 text-gray-500">Loading folders...</div>;
    }
    
    // Show error state
    if (error) {
      console.log('Showing error state:', error);
      return <div className="p-2 text-red-500">Error: {error}</div>;
    }
    
    // Show empty state
    if (!folders || folders.length === 0) {
      console.log('Showing no folders available state');
      return <div className="p-2 text-gray-500">No folders available</div>;
    }
    
    // Filter folders to show only the user's personal directory structure
    let filteredFolders = folders;
    if (user && user.id) {
      // Show only folders owned by the user
      // Note: folder.owner might be an object or just an ID depending on serialization
      filteredFolders = folders.filter(folder => {
        if (typeof folder.owner === 'object' && folder.owner !== null) {
          // owner is an object with an id property
          return folder.owner.id === user.id;
        } else {
          // owner is just an ID
          return folder.owner === user.id;
        }
      });
    }
    
    // For root level, show only root-level folders owned by the user
    // But also show personal folders that might have a parent (like emponly's Documents)
    const children = parentId === null 
      ? filteredFolders.filter(folder => 
          folder.parent_folder === null || 
          (folder.name && folder.name.includes("'s Documents"))
        )
      : filteredFolders.filter(folder => folder.parent_folder === parentId);
      
    console.log(`Children for parentId=${parentId}:`, children);
    
    if (children.length === 0) {
      console.log(`No children for parentId=${parentId}, returning null`);
      // If no folders are found for the user, show a message
      if (parentId === null) {
        return <div className="p-2 text-gray-500">No personal folders found. Please contact your administrator.</div>;
      }
      return null;
    }

    console.log(`Rendering ${children.length} children for parentId=${parentId}`);
    return (
      <div className="pl-4"> {/* Using pl-4 instead of ml-${level * 4} for better Tailwind support */}
        {children.map(folder => {
          console.log(`Rendering folder:`, folder);
          const hasChildren = filteredFolders.filter(f => f.parent_folder === folder.id).length > 0;
          const isExpanded = expandedFolders.has(folder.id);
          console.log(`Folder ${folder.id} hasChildren: ${hasChildren}, isExpanded: ${isExpanded}`);
          
          // Show just the username for personal folders instead of "{username}'s Documents"
          let displayName = folder.name;
          if (folder.name && folder.name.includes("'s Documents")) {
            // Extract just the username part
            const match = folder.name.match(/^(.+)'s Documents$/);
            if (match) {
              displayName = match[1];
            }
          }
          
          return (
            <div key={folder.id}>
              <div 
                className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${selectedFolder?.id === folder.id ? 'bg-gray-200' : ''}`}
                onClick={() => selectFolder(folder)}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(folder.id);
                  }}
                  className="mr-2 w-4 flex items-center justify-center"
                >
                  {hasChildren ? (
                    isExpanded ? '-' : '+'
                  ) : (
                    <span className="inline-block w-4"></span>
                  )}
                </button>
                <FolderIcon className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-sm truncate">{displayName}</span>
              </div>
              {isExpanded && renderFolderTree(folder.id, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  const handleDocumentAction = async (documentId, action) => {
    console.log(`Performing ${action} on document ${documentId}`);
    // In a real app, this would call your API
    try {
      switch (action) {
        case 'view':
          // View document logic
          break;
        case 'edit':
          // Edit document logic
          break;
        case 'delete':
          // Delete document logic
          break;
        case 'lock':
          // Lock document logic
          break;
        case 'unlock':
          // Unlock document logic
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing ${action} on document ${documentId}:`, error);
    }
  };

  const handleUploadDocument = async () => {
    console.log('Opening upload document modal');
    // In a real app, this would open an upload modal
    try {
      // Upload document logic would go here
      console.log('Upload document functionality would be implemented here');
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  // Filter documents based on search query and selected folder
  const filteredDocuments = documents.filter(doc => {
    // First, apply search filter
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.uploader_name && doc.uploader_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Then, apply folder filter
    if (selectedFolder) {
      // If a folder is selected, only show documents in that folder
      return matchesSearch && doc.folder === selectedFolder.id;
    } else {
      // If no folder is selected, show all documents the user has access to
      // Filter to show only documents uploaded by the user
      if (user && user.username) {
        return matchesSearch && doc.uploader_name === user.username;
      }
      return matchesSearch;
    }
  });

  return (
    <div className="flex h-full bg-white rounded-lg border border-gray-200">
      {/* Left Column - Folder Tree View (as per UserEmployee.md specification) */}
      <div className="w-64 border-r border-gray-200 p-4"> {/* Fixed width to w-64 as per specification */}
        <h3 className="font-semibold text-gray-800 mb-3">Folders</h3>
        <div className="mb-4">
          <button 
            onClick={handleUploadDocument}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload Document
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {renderFolderTree()}
        </div>
      </div>

      {/* Central Column - Document List & Controls */}
      <div className="flex-1 flex flex-col">
        {/* Top Sub-bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedFolder ? selectedFolder.name : 'My Documents'}
            </h2>
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option>All Types</option>
                <option>PDF</option>
                <option>Word</option>
                <option>Excel</option>
              </select>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option>All Tags</option>
                <option>Finance</option>
                <option>Marketing</option>
                <option>HR</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading documents...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              <p>{error}</p>
              <p className="text-sm text-gray-500 mt-2">Error loading documents.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onChange={selectAllDocuments}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploader</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lock Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr 
                        key={doc.id} 
                        className={`hover:bg-gray-50 ${selectedDocuments.some(d => d.id === doc.id) ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.some(d => d.id === doc.id)}
                            onChange={() => toggleDocumentSelection(doc.id)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => selectDocument(doc)}
                        >
                          <div className="flex items-center">
                            <DocumentIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploader}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.lastModified}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.version}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.lockedBy ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Locked by {doc.lockedBy}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Unlocked
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleDocumentAction(doc.id, 'view')}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <ViewIcon className="w-4 h-4" />
                            </button>
                            {doc.lockedBy ? (
                              <button 
                                onClick={() => handleDocumentAction(doc.id, 'unlock')}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Unlock"
                              >
                                <LockIcon className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleDocumentAction(doc.id, 'lock')}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Lock"
                              >
                                <LockIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDocumentAction(doc.id, 'edit')}
                              className="text-green-600 hover:text-green-900"
                              title="Edit"
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDocumentAction(doc.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        No documents found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocumentsPage;