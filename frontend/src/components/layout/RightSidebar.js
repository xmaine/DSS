import React, { useState } from 'react';
import { 
  DocumentIcon, 
  ShareIcon, 
  FolderIcon, 
  UploadIcon, 
  UserGroupIcon, 
  ReportIcon,
  ClockIcon,
  TagIcon,
  BackupIcon
} from '../ui/Icons';

const RightSidebar = ({ userRole, isSystemAdmin, activeSection }) => {
  const [activeTab, setActiveTab] = useState('properties');

  // Check if the user is an Employee
  const isEmployee = userRole === 'Employee';

  // Get content based on active section
  const getContentForSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return {
          statistics: {
            inbox: 8,
            total: 84,
            characters: '2,610,849',
            tags: 28,
            correspondents: 7,
            docTypes: 8,
          },
          documentInfo: {
            created: 'Oct 2, 2025',
            modified: 'Oct 5, 2025',
            size: '2.4 MB',
          },
          tags: ['Finance', 'Report', 'Urgent'],
          actions: [
            { id: 'upload', label: 'Upload', icon: <UploadIcon className="w-5 h-5" /> },
            { id: 'new-folder', label: 'New Folder', icon: <FolderIcon className="w-5 h-5" /> },
            { id: 'share', label: 'Share', icon: <ShareIcon className="w-5 h-5" /> },
            { id: 'new-doc', label: 'New Doc', icon: <DocumentIcon className="w-5 h-5" /> },
          ]
        };
      case 'my-documents':
      case 'document-library':
      case 'all-folders':
        return {
          statistics: {
            total: 42,
            folders: 12,
            shared: 5,
            recent: 8,
          },
          documentInfo: {
            lastUpload: 'Oct 12, 2025',
            mostActive: 'Finance Documents',
            storage: '1.2 GB',
          },
          tags: ['Important', 'Review', 'Draft'],
          actions: [
            { id: 'upload', label: 'Upload Document', icon: <UploadIcon className="w-5 h-5" /> },
            { id: 'new-folder', label: 'New Folder', icon: <FolderIcon className="w-5 h-5" /> },
            { id: 'search', label: 'Advanced Search', icon: <DocumentIcon className="w-5 h-5" /> },
          ]
        };
      case 'user-management':
      case 'department-management':
        return {
          statistics: {
            totalUsers: 24,
            active: 22,
            admins: 2,
            departments: 4,
          },
          documentInfo: {
            lastLogin: 'Oct 14, 2025',
            recentSignup: 'John Doe',
            pending: 1,
          },
          tags: ['Admin', 'Active', 'Pending'],
          actions: [
            { id: 'add-user', label: 'Add User', icon: <UserGroupIcon className="w-5 h-5" /> },
            { id: 'add-dept', label: 'Add Department', icon: <FolderIcon className="w-5 h-5" /> },
            { id: 'export', label: 'Export Users', icon: <ReportIcon className="w-5 h-5" /> },
          ]
        };
      case 'workflows':
        return {
          statistics: {
            active: 5,
            completed: 12,
            pending: 3,
            templates: 8,
          },
          documentInfo: {
            lastModified: 'Oct 13, 2025',
            mostUsed: 'Approval Workflow',
            avgTime: '2.3 days',
          },
          tags: ['Active', 'Pending', 'Completed'],
          actions: [
            { id: 'new-workflow', label: 'New Workflow', icon: <BackupIcon className="w-5 h-5" /> },
            { id: 'view-templates', label: 'View Templates', icon: <DocumentIcon className="w-5 h-5" /> },
            { id: 'reports', label: 'Workflow Reports', icon: <ReportIcon className="w-5 h-5" /> },
          ]
        };
      default:
        return {
          statistics: {
            inbox: 0,
            total: 0,
            characters: '0',
            tags: 0,
            correspondents: 0,
            docTypes: 0,
          },
          documentInfo: {
            created: 'N/A',
            modified: 'N/A',
            size: '0 MB',
          },
          tags: [],
          actions: [
            { id: 'view', label: 'View Details', icon: <DocumentIcon className="w-5 h-5" /> },
            { id: 'edit', label: 'Edit', icon: <DocumentIcon className="w-5 h-5" /> },
          ]
        };
    }
  };

  const content = getContentForSection();

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
        { id: 'api-diagnostics', label: 'API Diagnostics', icon: <ReportIcon className="w-5 h-5" />, path: 'api-diagnostics' },
      ];
    } else {
      return [
        { id: 'my-documents', label: 'My Documents', icon: <DocumentIcon className="w-5 h-5" />, path: 'my-documents' },
        { id: 'shared-with-me', label: 'Shared With Me', icon: <ShareIcon className="w-5 h-5" />, path: 'shared-with-me' },
        { id: 'recent-documents', label: 'Recent Documents', icon: <ClockIcon className="w-5 h-5" />, path: 'recent-documents' },
        { id: 'document-types', label: 'Document Types', icon: <TagIcon className="w-5 h-5" />, path: 'document-types' },
        { id: 'api-diagnostics', label: 'API Diagnostics', icon: <ReportIcon className="w-5 h-5" />, path: 'api-diagnostics' },
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

  // Render statistics based on section
  const renderStatistics = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <ul className="text-xs text-gray-700 space-y-1">
            <li className="flex justify-between">
              <span>Documents in inbox:</span>
              <span className="font-medium text-black">{content.statistics.inbox}</span>
            </li>
            <li className="flex justify-between">
              <span>Total documents:</span>
              <span className="font-medium text-black">{content.statistics.total}</span>
            </li>
            <li className="flex justify-between">
              <span>Total characters:</span>
              <span className="font-medium text-black">{content.statistics.characters}</span>
            </li>
            <hr className="border-gray-200 my-1"/>
            <li className="flex justify-between">
              <span>Tags:</span>
              <span className="font-medium text-black">{content.statistics.tags}</span>
            </li>
            <li className="flex justify-between">
              <span>Correspondents:</span>
              <span className="font-medium text-black">{content.statistics.correspondents}</span>
            </li>
            <li className="flex justify-between">
              <span>Document Types:</span>
              <span className="font-medium text-black">{content.statistics.docTypes}</span>
            </li>
          </ul>
        );
      case 'my-documents':
      case 'document-library':
      case 'all-folders':
        return (
          <ul className="text-xs text-gray-700 space-y-1">
            <li className="flex justify-between">
              <span>Total documents:</span>
              <span className="font-medium text-black">{content.statistics.total}</span>
            </li>
            <li className="flex justify-between">
              <span>Folders:</span>
              <span className="font-medium text-black">{content.statistics.folders}</span>
            </li>
            <li className="flex justify-between">
              <span>Shared with you:</span>
              <span className="font-medium text-black">{content.statistics.shared}</span>
            </li>
            <hr className="border-gray-200 my-1"/>
            <li className="flex justify-between">
              <span>Recently modified:</span>
              <span className="font-medium text-black">{content.statistics.recent}</span>
            </li>
          </ul>
        );
      case 'user-management':
      case 'department-management':
        return (
          <ul className="text-xs text-gray-700 space-y-1">
            <li className="flex justify-between">
              <span>Total users:</span>
              <span className="font-medium text-black">{content.statistics.totalUsers}</span>
            </li>
            <li className="flex justify-between">
              <span>Active users:</span>
              <span className="font-medium text-black">{content.statistics.active}</span>
            </li>
            <li className="flex justify-between">
              <span>Administrators:</span>
              <span className="font-medium text-black">{content.statistics.admins}</span>
            </li>
            <hr className="border-gray-200 my-1"/>
            <li className="flex justify-between">
              <span>Departments:</span>
              <span className="font-medium text-black">{content.statistics.departments}</span>
            </li>
          </ul>
        );
      case 'workflows':
        return (
          <ul className="text-xs text-gray-700 space-y-1">
            <li className="flex justify-between">
              <span>Active workflows:</span>
              <span className="font-medium text-black">{content.statistics.active}</span>
            </li>
            <li className="flex justify-between">
              <span>Completed:</span>
              <span className="font-medium text-black">{content.statistics.completed}</span>
            </li>
            <li className="flex justify-between">
              <span>Pending approval:</span>
              <span className="font-medium text-black">{content.statistics.pending}</span>
            </li>
            <hr className="border-gray-200 my-1"/>
            <li className="flex justify-between">
              <span>Workflow templates:</span>
              <span className="font-medium text-black">{content.statistics.templates}</span>
            </li>
          </ul>
        );
      default:
        return (
          <ul className="text-xs text-gray-700 space-y-1">
            <li className="flex justify-between">
              <span>Items:</span>
              <span className="font-medium text-black">{content.statistics.total}</span>
            </li>
          </ul>
        );
    }
  };

  // Render document info based on section
  const renderDocumentInfo = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{content.documentInfo.created}</span>
            </div>
            <div className="flex justify-between">
              <span>Modified:</span>
              <span>{content.documentInfo.modified}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{content.documentInfo.size}</span>
            </div>
          </div>
        );
      case 'my-documents':
      case 'document-library':
      case 'all-folders':
        return (
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Last upload:</span>
              <span>{content.documentInfo.lastUpload}</span>
            </div>
            <div className="flex justify-between">
              <span>Most active folder:</span>
              <span>{content.documentInfo.mostActive}</span>
            </div>
            <div className="flex justify-between">
              <span>Storage used:</span>
              <span>{content.documentInfo.storage}</span>
            </div>
          </div>
        );
      case 'user-management':
      case 'department-management':
        return (
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Last login:</span>
              <span>{content.documentInfo.lastLogin}</span>
            </div>
            <div className="flex justify-between">
              <span>Recent signup:</span>
              <span>{content.documentInfo.recentSignup}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending users:</span>
              <span>{content.documentInfo.pending}</span>
            </div>
          </div>
        );
      case 'workflows':
        return (
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Last modified:</span>
              <span>{content.documentInfo.lastModified}</span>
            </div>
            <div className="flex justify-between">
              <span>Most used workflow:</span>
              <span>{content.documentInfo.mostUsed}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. completion time:</span>
              <span>{content.documentInfo.avgTime}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{content.documentInfo.created}</span>
            </div>
            <div className="flex justify-between">
              <span>Modified:</span>
              <span>{content.documentInfo.modified}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* Header with title - only show for non-Employee users */}
      {!isEmployee && (
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">Options</h2>
        </div>
      )}

      {/* Tab Headers - only show for non-Employee users */}
      {!isEmployee && (
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
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* For Employee users, only show Properties content */}
        {isEmployee ? (
          <div className="space-y-4">
            {/* Statistics Panel */}
            <div className="bg-white rounded border border-gray-200 p-3">
              <h3 className="font-semibold text-black mb-2">Statistics</h3>
              {renderStatistics()}
            </div>
            
            {/* Document Info Panel */}
            <div className="bg-white p-3 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Info</h3>
              {renderDocumentInfo()}
            </div>
            
            {/* Tags Panel */}
            <div className="bg-white p-3 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {content.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* For non-Employee users, show tabbed content */
          <>
            {activeTab === 'properties' && (
              <div className="space-y-4">
                {/* Statistics Panel */}
                <div className="bg-white rounded border border-gray-200 p-3">
                  <h3 className="font-semibold text-black mb-2">Statistics</h3>
                  {renderStatistics()}
                </div>
                
                {/* Document Info Panel */}
                <div className="bg-white p-3 rounded border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Info</h3>
                  {renderDocumentInfo()}
                </div>
                
                {/* Tags Panel */}
                <div className="bg-white p-3 rounded border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {content.tags.map((tag, index) => (
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
                  {content.actions.map((button) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;