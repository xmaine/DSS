import React, { useState, useEffect } from 'react';
import { FolderIcon, DocumentIcon, UploadIcon, SearchIcon } from '../ui/Icons';

const EmployeeDocumentsPage = () => {
  // Mock data - in a real app, this would come from your API
  const [folders, setFolders] = useState([
    { id: 1, name: 'Finance Documents', parentId: null, level: 0 },
    { id: 2, name: 'Q3 Reports', parentId: 1, level: 1 },
    { id: 3, name: 'Budget Plans', parentId: 1, level: 1 },
    { id: 4, name: 'Marketing Docs', parentId: null, level: 0 },
    { id: 5, name: 'Campaigns', parentId: 4, level: 1 },
    { id: 6, name: 'Brand Assets', parentId: 4, level: 1 },
    { id: 7, name: 'HR Documents', parentId: null, level: 0 },
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Q3 Financial Report.pdf', type: 'PDF', uploader: 'John Smith', lastModified: '2025-10-15', version: '1.2', lockedBy: null, tags: ['Finance', 'Report'] },
    { id: 2, name: 'Marketing Budget Q3.xlsx', type: 'Excel', uploader: 'Jane Doe', lastModified: '2025-10-14', version: '1.0', lockedBy: 'Mike Johnson', tags: ['Marketing', 'Budget'] },
    { id: 3, name: 'Employee Handbook.pdf', type: 'PDF', uploader: 'HR Department', lastModified: '2025-10-10', version: '2.1', lockedBy: null, tags: ['HR', 'Policy'] },
  ]);

  const [expandedFolders, setExpandedFolders] = useState(new Set([1, 4]));
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  };

  const getChildren = (parentId) => {
    return folders.filter(folder => folder.parentId === parentId);
  };

  const renderFolderTree = (parentId = null, level = 0) => {
    const children = getChildren(parentId);
    if (children.length === 0) return null;

    return (
      <div className={`ml-${level * 4}`}>
        {children.map(folder => (
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
                className="mr-2"
              >
                {getChildren(folder.id).length > 0 ? (
                  expandedFolders.has(folder.id) ? '▼' : '►'
                ) : (
                  <span className="inline-block w-4"></span>
                )}
              </button>
              <FolderIcon className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm">{folder.name}</span>
            </div>
            {expandedFolders.has(folder.id) && renderFolderTree(folder.id, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  const handleDocumentAction = (documentId, action) => {
    console.log(`Performing ${action} on document ${documentId}`);
    // In a real app, this would call your API
  };

  const handleUploadDocument = () => {
    console.log('Opening upload document modal');
    // In a real app, this would open an upload modal
  };

  return (
    <div className="flex h-full bg-white rounded-lg border border-gray-200">
      {/* Left Column - Folder Tree View */}
      <div className="w-1/4 border-r border-gray-200 p-4">
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
              {selectedFolder ? selectedFolder.name : 'All Documents'}
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                      <button 
                        onClick={() => handleDocumentAction(doc.id, 'view')}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {doc.lockedBy ? (
                        <button 
                          onClick={() => handleDocumentAction(doc.id, 'unlock')}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Unlock
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDocumentAction(doc.id, 'lock')}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Lock
                        </button>
                      )}
                      <button 
                        onClick={() => handleDocumentAction(doc.id, 'edit')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocumentsPage;