import React, { useState, useEffect, useCallback } from 'react';
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
import { getFolders, getDocuments, createFolder, shareFolder } from '../../services/api';
import { validateMachineToken } from '../../utils/machineToken';

const EmployeeDocumentsPage = ({ onDocumentSelect, user }) => {
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]); // For multiple selection
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDropdown, setShowUploadDropdown] = useState(false); // For upload dropdown
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, folder: null }); // For folder context menu

  // Fetch folders and documents from the database
  const fetchData = useCallback(async () => {
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
        // Log the raw folder data for debugging
        console.log('Raw folder data from API:', foldersResponse.data);
        
        // Filter folders to only show those owned by the current user
        const userFolders = foldersResponse.data.filter(folder => {
          // Check if folder is owned by current user
          const isOwnedByUser = (typeof folder.owner === 'object' && folder.owner !== null) 
            ? folder.owner.id === user.id 
            : folder.owner === user.id;
          
          console.log(`Folder ${folder.name} (ID: ${folder.id}) - Owner: ${folder.owner}, User ID: ${user.id}, Owned by user: ${isOwnedByUser}`);
          return isOwnedByUser;
        });
        
        console.log('Filtered user folders:', userFolders);
        setFolders(userFolders);
        console.log('Folders state updated with', userFolders.length, 'folders');
        
        // Expand the first level folders by default
        const topLevelFolders = userFolders.filter(folder => 
          folder.parent_folder === null || 
          (folder.name && folder.name.includes("'s Documents"))
        );
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
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set the home folder as selected by default
  useEffect(() => {
    if (folders.length > 0 && !selectedFolder) {
      // Find the home folder (the one with "'s Documents" in the name)
      const homeFolder = folders.find(folder => folder.name && folder.name.includes("'s Documents"));
      if (homeFolder) {
        setSelectedFolder(homeFolder);
      }
    }
  }, [folders, selectedFolder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUploadDropdown && event.target.closest('#upload-combobox') === null) {
        setShowUploadDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUploadDropdown]);

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
    // Allow selection of any folder for navigation/display purposes
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
    
    // For root level, show only root-level folders owned by the user
    // But also show personal folders at the root level even if they have a parent
    const children = parentId === null 
      ? folders.filter(folder => 
          folder.parent_folder === null || 
          (folder.name && folder.name.includes("'s Documents"))
        )
      : folders.filter(folder => folder.parent_folder === parentId);
      
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
          const hasChildren = folders.filter(f => f.parent_folder === folder.id).length > 0;
          const isExpanded = expandedFolders.has(folder.id);
          const isHomeFolder = folder.name && folder.name.includes("'s Documents");
          console.log(`Folder ${folder.id} hasChildren: ${hasChildren}, isExpanded: ${isExpanded}, isHomeFolder: ${isHomeFolder}`);
          
          // Show just the username for personal folders instead of "{username}'s Documents"
          let displayName = folder.name;
          if (isHomeFolder) {
            // Extract just the username part and add (Home)
            const match = folder.name.match(/^(.+)'s Documents$/);
            if (match) {
              displayName = `${match[1]} (Home)`;
            }
          }
          
          return (
            <div key={folder.id}>
              <div 
                className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${selectedFolder?.id === folder.id ? 'bg-gray-200' : ''} ${isHomeFolder ? 'font-semibold' : ''}`}
                onClick={() => selectFolder(folder)}
                onContextMenu={(e) => handleFolderRightClick(e, folder)}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(folder.id);
                  }}
                  className="mr-2 w-4 flex items-center justify-center"
                  title="Toggle folder"
                >
                  {hasChildren ? (
                    isExpanded ? (
                      <span className="text-sm font-bold">-</span>
                    ) : (
                      <span className="text-sm font-bold">+</span>
                    )
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

  const handleUploadFiles = async () => {
    console.log('Opening upload files dialog');
    try {
      // Validate machine token before allowing upload
      const isValid = await validateMachineToken(user.username);
      if (!isValid) {
        alert('Machine token validation failed. Please contact your administrator.');
        return;
      }
      
      // In a real application, this would open a file upload dialog
      // For now, we'll simulate the process
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true; // Allow multiple file selection
      fileInput.onchange = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          alert(`${files.length} file(s) selected for upload. In a real application, these would be uploaded to the server.`);
          // In a real app, you would:
          // 1. Create FormData
          // 2. Add the files to FormData
          // 3. Call createDocument API endpoint for each file
          // 4. Refresh the document list
          await fetchData(); // Refresh the data
        }
      };
      fileInput.click();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files: ' + error.message);
    }
  };

  const handleUploadFolders = async () => {
    console.log('Opening upload folders dialog');
    try {
      // Validate machine token before allowing upload
      const isValid = await validateMachineToken(user.username);
      if (!isValid) {
        alert('Machine token validation failed. Please contact your administrator.');
        return;
      }
      
      // In a real application, this would open a folder upload dialog
      // For now, we'll show an alert
      alert('Upload folders functionality would be implemented here. In a real application, this would allow you to upload entire folder structures.');
    } catch (error) {
      console.error('Error uploading folders:', error);
      alert('Error uploading folders: ' + error.message);
    }
  };

  const handleCreateFolder = async () => {
    console.log('Opening create folder dialog');
    try {
      // In a real application, this would open a folder creation dialog
      // For now, we'll use a prompt to get the folder name
      const folderName = prompt('Enter the name for the new folder:');
      if (folderName) {
        // Create folder data with proper path
        const folderData = {
          name: folderName,
          owner: user.id, // Set the current user as owner
          is_active: true
        };
        
        // Determine the path based on the selected folder or user's department
        if (selectedFolder) {
          // If a folder is selected, set it as the parent and create path
          folderData.parent_folder = selectedFolder.id;
          // For nested folders, we need to build the path correctly
          if (selectedFolder.path) {
            folderData.path = `${selectedFolder.path}/${folderName}`;
          } else {
            // Fallback if path is not available
            folderData.path = `/${folderName}`;
          }
        } else {
          // If no folder is selected, create in user's department folder
          // This follows the pattern from the backend signals
          if (user.department) {
            folderData.path = `/${user.department} Documents/${folderName}`;
          } else {
            folderData.path = `/${folderName}`;
          }
        }
        
        console.log('Creating folder with data:', folderData);
        
        // Call the API to create the folder
        await createFolder(folderData);
        console.log(`Folder "${folderName}" created successfully`);
        
        // Refresh the folder list
        await fetchData();
        
        alert(`Folder "${folderName}" created successfully!`);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      alert('Error creating folder: ' + (error.response?.data?.detail || error.response?.data || error.message || 'Unknown error'));
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing documents and folders');
    try {
      // Refresh the data
      await fetchData();
      console.log('Refresh completed successfully');
      alert('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Error refreshing data: ' + error.message);
    }
  };

  // Handle right-click on folder to show context menu
  const handleFolderRightClick = (e, folder) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      folder: folder
    });
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Folder context menu actions
  const handleRenameFolder = () => {
    if (!contextMenu.folder) return;
    
    const newName = prompt('Enter new folder name:', contextMenu.folder.name);
    if (newName && newName !== contextMenu.folder.name) {
      // In a real app, this would call an API to rename the folder
      console.log(`Renaming folder ${contextMenu.folder.id} to ${newName}`);
      alert(`Folder renamed to ${newName}`);
      setContextMenu(prev => ({ ...prev, visible: false }));
      fetchData(); // Refresh the folder list
    }
  };

  const handleCopyFolder = () => {
    if (!contextMenu.folder) return;
    
    // In a real app, this would copy the folder
    console.log(`Copying folder ${contextMenu.folder.id}`);
    alert(`Folder copied`);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleMoveFolder = () => {
    if (!contextMenu.folder) return;
    
    // In a real app, this would move the folder
    // Move is only applicable within the home directory of the user
    console.log(`Moving folder ${contextMenu.folder.id}`);
    alert(`Folder moved`);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleDeleteFolder = () => {
    if (!contextMenu.folder) return;
    
    // Prevent deletion of home folder
    if (contextMenu.folder.name && contextMenu.folder.name.includes("'s Documents")) {
      alert("You cannot delete your home folder.");
      setContextMenu(prev => ({ ...prev, visible: false }));
      return;
    }
    
    const confirmDelete = window.confirm(`Are you sure you want to delete folder ${contextMenu.folder.name}?`);
    if (confirmDelete) {
      // In a real app, this would call an API to delete the folder
      console.log(`Deleting folder ${contextMenu.folder.id}`);
      alert(`Folder deleted`);
      setContextMenu(prev => ({ ...prev, visible: false }));
      fetchData(); // Refresh the folder list
    }
  };

  const handleShareFolder = async () => {
    if (!contextMenu.folder) return;
    
    try {
      // In a real app, this would share the folder with specified users
      console.log(`Sharing folder ${contextMenu.folder.id}`);
      // Example API call:
      // await shareFolder(contextMenu.folder.id, { shared_with_user: userId, permission_level: 'VIEW' });
      alert(`Folder shared successfully`);
      setContextMenu(prev => ({ ...prev, visible: false }));
    } catch (error) {
      console.error('Error sharing folder:', error);
      alert('Error sharing folder: ' + error.message);
    }
  };
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
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Folders</h3>
          <button 
            onClick={handleCreateFolder}
            className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            title="Add Folder"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {renderFolderTree()}
        </div>
      </div>

      {/* Central Column - Document List & Controls */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Navigation Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative inline-block text-left">
                <button 
                  onClick={() => setShowUploadDropdown(!showUploadDropdown)}
                  id="upload-combobox"
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                  title="Upload"
                >
                  <UploadIcon className="w-4 h-4 mr-1" />
                  <span>Upload</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showUploadDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setShowUploadDropdown(false);
                          handleUploadFiles();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Upload Files
                      </button>
                      <button 
                        onClick={() => {
                          setShowUploadDropdown(false);
                          handleUploadFolders();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Upload Folder
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={handleRefresh}
                className="flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                title="Refresh"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
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
      
      {/* Folder Context Menu */}
      {contextMenu.visible && (
        <div 
          className="absolute bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleRenameFolder}
          >
            Rename
          </button>
          <button 
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleCopyFolder}
          >
            Copy
          </button>
          <button 
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleMoveFolder}
          >
            Move
          </button>
          <button 
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleDeleteFolder}
          >
            Delete
          </button>
          <button 
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleShareFolder}
          >
            Share
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDocumentsPage;