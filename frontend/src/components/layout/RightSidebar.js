import React, { useState } from 'react';
import { 
  DocumentIcon, 
  ShareIcon, 
  FolderIcon, 
  UploadIcon, 
  UserGroupIcon, 
  ReportIcon,
  ClockIcon,
  TagIcon
} from '../ui/Icons';

const RightSidebar = ({ userRole, isSystemAdmin }) => {
  const [activeTab, setActiveTab] = useState('properties');

  // Mock statistics data (this would come from props or API in a real app)
  const mockStats = {
    inbox: 8,
    total: 84,
    characters: '2,610,849',
    tags: 28,
    correspondents: 7,
    docTypes: 8,
  };

  // Mock document info
  const documentInfo = {
    created: 'Oct 2, 2025',
    modified: 'Oct 5, 2025',
    size: '2.4 MB',
  };

  // Mock tags
  const tags = ['Finance', 'Report', 'Urgent'];

  // Action buttons - changed to list format like Quick Links
  const actionButtons = [
    { id: 'upload', label: 'Upload', icon: <UploadIcon className="w-5 h-5" /> },
    { id: 'new-folder', label: 'New Folder', icon: <FolderIcon className="w-5 h-5" /> },
    { id: 'share', label: 'Share', icon: <ShareIcon className="w-5 h-5" /> },
    { id: 'new-doc', label: 'New Doc', icon: <DocumentIcon className="w-5 h-5" /> },
  ];

  // Quick links with icons
  const getQuickLinks = () => {
    if (isSystemAdmin) {
      return [
        { id: 'my-documents', label: 'My Documents', icon: <DocumentIcon className="w-5 h-5" />, path: 'my-documents' },
        { id: 'shared-with-me', label: 'Shared With Me', icon: <ShareIcon className="w-5 h-5" />, path: 'shared-with-me' },
        { id: 'recent-documents', label: 'Recent Documents', icon: <ClockIcon className="w-5 h-5" />, path: 'recent-documents' },
        { id: 'document-types', label: 'Document Types', icon: <TagIcon className="w-5 h-5" />, path: 'document-types' },
        { id: 'user-management', label: 'User Management', icon: <UserGroupIcon className="w-5 h-5" />, path: 'user-management' },
        { id: 'audit-logs', label: 'Audit Logs', icon: <ReportIcon className="w-5 h-5" />, path: 'audit-logs' },
      ];
    } else {
      return [
        { id: 'my-documents', label: 'My Documents', icon: <DocumentIcon className="w-5 h-5" />, path: 'my-documents' },
        { id: 'shared-with-me', label: 'Shared With Me', icon: <ShareIcon className="w-5 h-5" />, path: 'shared-with-me' },
        { id: 'recent-documents', label: 'Recent Documents', icon: <ClockIcon className="w-5 h-5" />, path: 'recent-documents' },
        { id: 'document-types', label: 'Document Types', icon: <TagIcon className="w-5 h-5" />, path: 'document-types' },
      ];
    }
  };

  const quickLinks = getQuickLinks();

  const handleActionClick = (actionId) => {
    console.log('Action clicked:', actionId);
    // In a real app, this would trigger the appropriate action
  };

  const handleQuickLinkClick = (linkId) => {
    console.log('Quick link clicked:', linkId);
    // In a real app, this would navigate to the appropriate page
  };

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* Header with title */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">Options</h2>
      </div>

      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'properties'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'actions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'quick-links'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('quick-links')}
        >
          Quick Links
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'properties' && (
          <div className="space-y-4">
            {/* Statistics Panel */}
            <div className="bg-white rounded border border-gray-200 p-3">
              <h3 className="font-semibold text-black mb-2">Statistics</h3>
              <ul className="text-xs text-gray-700 space-y-1">
                <li className="flex justify-between">
                  <span>Documents in inbox:</span>
                  <span className="font-medium text-black">{mockStats.inbox}</span>
                </li>
                <li className="flex justify-between">
                  <span>Total documents:</span>
                  <span className="font-medium text-black">{mockStats.total}</span>
                </li>
                <li className="flex justify-between">
                  <span>Total characters:</span>
                  <span className="font-medium text-black">{mockStats.characters}</span>
                </li>
                <hr className="border-gray-200 my-1"/>
                <li className="flex justify-between">
                  <span>Tags:</span>
                  <span className="font-medium text-black">{mockStats.tags}</span>
                </li>
                <li className="flex justify-between">
                  <span>Correspondents:</span>
                  <span className="font-medium text-black">{mockStats.correspondents}</span>
                </li>
                <li className="flex justify-between">
                  <span>Document Types:</span>
                  <span className="font-medium text-black">{mockStats.docTypes}</span>
                </li>
              </ul>
            </div>
            
            {/* Document Info Panel */}
            <div className="bg-white p-3 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Document Info</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{documentInfo.created}</span>
                </div>
                <div className="flex justify-between">
                  <span>Modified:</span>
                  <span>{documentInfo.modified}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{documentInfo.size}</span>
                </div>
              </div>
            </div>
            
            {/* Tags Panel */}
            <div className="bg-white p-3 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="bg-white rounded border border-gray-200 p-3">
            <div className="space-y-2">
              {actionButtons.map((button) => (
                <button
                  key={button.id}
                  className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm flex items-center space-x-2"
                  onClick={() => handleActionClick(button.id)}
                >
                  {button.icon}
                  <span>{button.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quick-links' && (
          <div className="bg-white rounded border border-gray-200 p-3">
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm flex items-center space-x-2"
                  onClick={() => handleQuickLinkClick(link.id)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;