import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import UserManagement from './admin/UserManagement';
import DocumentTypes from './admin/DocumentTypes';
import Correspondents from './admin/Correspondents';
import Tags from './admin/Tags';
import Workflows from './admin/Workflows';
import SettingsPage from './pages/SettingsPage'; // Import SettingsPage
import { 
  SearchIcon, 
  UserCircleIcon, 
  MenuIcon, 
  NotificationIcon, 
  DocumentIcon 
} from './ui/Icons';
import { logout } from '../services/api'; // Import logout function

const MainApp = ({ onLogout, user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('Employee'); // Default to Employee role
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user dropdown menu

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleRoleChange = (role) => {
    setUserRole(role);
    // Reset to dashboard when changing roles
    setActiveSection('dashboard');
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      console.log('Attempting to logout...');
      const response = await logout();
      console.log('Logout response:', response);
      
      // Notify parent component to handle logout if provided
      if (onLogout && typeof onLogout === 'function') {
        console.log('Calling parent onLogout function');
        onLogout();
      } else {
        console.error('onLogout is not a function or not provided:', typeof onLogout);
      }
    } catch (error) {
      console.error('Logout error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      
      // Even if logout fails, notify parent to handle logout if provided
      if (onLogout && typeof onLogout === 'function') {
        console.log('Calling parent onLogout function despite error');
        onLogout();
      } else {
        console.error('onLogout is not a function or not provided:', typeof onLogout);
      }
    } finally {
      // Close the user menu
      setIsUserMenuOpen(false);
    }
  };

  const renderActivePage = () => {
    // Check if user is System Administrator
    const isSystemAdmin = userRole === 'System Administrator';
    
    switch (activeSection) {
      case 'dashboard':
        return isSystemAdmin ? <AdminDashboardPage /> : <DashboardPage />;
      case 'my-documents':
        return isSystemAdmin ? <DocumentsPage isAdminView={true} /> : <DocumentsPage />;
      case 'shared-with-me':
      case 'recent-documents':
      case 'document-library':
      case 'my-owned-documents':
        return <DocumentsPage />;
      case 'my-folders':
      case 'shared-folders':
      case 'all-folders':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Folder management page will be implemented here.</p>
          </div>
        );
      case 'user-management':
        return <UserManagement />;
      case 'department-users':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Department users page will be implemented here.</p>
          </div>
        );
      case 'role-management':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Role management page will be implemented here.</p>
          </div>
        );
      case 'permission-settings':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Permission settings page will be implemented here.</p>
          </div>
        );
      case 'document-types':
        return <DocumentTypes />;
      case 'tags-correspondents':
        return (
          <div className="space-y-6">
            <Tags />
            <Correspondents />
          </div>
        );
      case 'version-history':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Version history page will be implemented here.</p>
          </div>
        );
      case 'file-locking':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">File locking page will be implemented here.</p>
          </div>
        );
      case 'notifications':
      case 'notifs':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Notifications page will be implemented here.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Reports page will be implemented here.</p>
          </div>
        );
      case 'settings':
      case 'system-config':
        return <SettingsPage />;
      case 'upload-document':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Upload document page will be implemented here.</p>
          </div>
        );
      case 'create-folder':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Create folder page will be implemented here.</p>
          </div>
        );
      case 'share-document':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Share document page will be implemented here.</p>
          </div>
        );
      case 'rate-document':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Rate document page will be implemented here.</p>
          </div>
        );
      case 'link-document':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Link document page will be implemented here.</p>
          </div>
        );
      case 'search':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Search page will be implemented here.</p>
          </div>
        );
      case 'workflows':
        return <Workflows />;
      case 'audit-logs':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Audit logs page will be implemented here.</p>
          </div>
        );
      case 'team-management':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700">Team management page will be implemented here.</p>
          </div>
        );
      default:
        return isSystemAdmin ? <AdminDashboardPage /> : <DashboardPage />;
    }
  };

  // Role options for the selector
  const roleOptions = [
    'System Administrator',
    'Senior Department Head',
    'Department Head',
    'Employee'
  ];

  return (
    // YouTube-style light theme layout
    <div className="h-screen w-full bg-white flex overflow-hidden font-sans text-gray-800">
      {/* --- YouTube-Style Header --- */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <div className="flex items-center">
          {/* Burger button */}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
          >
            <MenuIcon className="w-6 h-6 text-black" />
          </button>
          
          {/* System icon and name aligned with Dashboard label */}
          <div className="flex items-center">
            <DocumentIcon className="w-6 h-6 text-red-600" />
            <span className="ml-2 text-lg font-bold text-black">Document Solutions</span>
          </div>
          
          {/* Menu labels with 50px distance */}
          <div className="hidden md:flex items-center ml-12 space-x-10">
            <button className="text-sm font-medium text-black hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">FILE</button>
            <button className="text-sm font-medium text-black hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">EDIT</button>
            <button className="text-sm font-medium text-black hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">VIEW</button>
            <button className="text-sm font-medium text-black hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">TOOLS</button>
            <button className="text-sm font-medium text-black hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">WINDOW</button>
            <button className="text-sm font-medium text-black hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">HELP</button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 600px search textbox */}
          <div className="relative" style={{ width: '600px' }}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Notification bell */}
          <div className="relative">
            <button 
              onClick={() => handleSectionChange('notifications')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <NotificationIcon className="w-6 h-6 text-black" />
            </button>
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
          </div>
          
          {/* Role selector */}
          <select 
            value={userRole} 
            onChange={(e) => handleRoleChange(e.target.value)}
            className="hidden lg:block text-sm bg-gray-100 border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {roleOptions.map(role => (
              <option key={role} value={role} className="bg-white">{role}</option>
            ))}
          </select>
          
          {/* User dropdown menu */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="hidden md:inline text-sm font-medium text-black">
                Hello, {user ? user.username : 'User'}
              </span>
              <UserCircleIcon className="w-8 h-8 text-black" />
            </button>
            
            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <p className="font-medium">User Menu</p>
                </div>
                <button
                  onClick={() => {
                    handleSectionChange('settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Preferences
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsUserMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Main Content Area (Adjusted for Header) --- */}
      <main className="flex-1 flex w-full pt-16 overflow-hidden">
        {/* --- YouTube-Style Left Sidebar --- */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggle={() => setSidebarOpen(!isSidebarOpen)} 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          userRole={userRole}
        />
        
        {/* --- Central Work Area --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* --- Document Content Area --- */}
          <div className="flex-grow overflow-y-auto p-4 bg-white">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-black">
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'my-documents' && 'My Documents'}
                {activeSection === 'shared-with-me' && 'Shared With Me'}
                {activeSection === 'recent-documents' && 'Recent Documents'}
                {activeSection === 'search' && 'Search'}
                {activeSection === 'document-library' && 'Document Library'}
                {activeSection === 'my-folders' && 'My Folders'}
                {activeSection === 'shared-folders' && 'Shared Folders'}
                {activeSection === 'all-folders' && 'All Folders'}
                {activeSection === 'user-management' && 'User Management'}
                {activeSection === 'role-management' && 'Role Management'}
                {activeSection === 'permission-settings' && 'Permission Settings'}
                {activeSection === 'document-types' && 'Document Types'}
                {activeSection === 'tags-correspondents' && 'Tags & Correspondents'}
                {activeSection === 'version-history' && 'Version History'}
                {activeSection === 'file-locking' && 'File Locking'}
                {activeSection === 'notifications' && 'Notifications'}
                {activeSection === 'reports' && 'Reports'}
                {activeSection === 'settings' && 'Settings'}
                {activeSection === 'upload-document' && 'Upload Document'}
                {activeSection === 'create-folder' && 'Create Folder'}
                {activeSection === 'share-document' && 'Share Document/Folder'}
                {activeSection === 'rate-document' && 'Rate Document'}
                {activeSection === 'link-document' && 'Link Document'}
                {activeSection === 'department-users' && 'Department Users'}
                {activeSection === 'system-config' && 'System Configuration'}
                {activeSection === 'workflows' && 'Workflows'}
                {activeSection === 'audit-logs' && 'Audit Logs'}
                {activeSection === 'team-management' && 'Team Management'}
                {activeSection === 'my-owned-documents' && 'My Documents'}
                {activeSection === 'notifs' && 'Notifications'}
              </h1>
            </div>
            {renderActivePage()}
          </div>
        </div>

        {/* --- Right Property Panels --- */}
        {activeSection === 'dashboard' && (
          <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* --- Properties Panel --- */}
            <div className="flex-1 overflow-y-auto p-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Properties</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Document Info</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>Oct 2, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modified:</span>
                      <span>Oct 5, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>2.4 MB</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border border-gray-200">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Finance</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Report</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Urgent</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* --- Removed Tools Panel --- */}
          </div>
        )}
      </main>

      {/* --- Bottom Status Bar (Half the height of header, overlay all elements) --- */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-3 text-xs text-gray-600 z-50">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span className="hidden sm:inline">Document Solutions v1.0</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Online</span>
          <span>84 documents</span>
        </div>
      </div>
    </div>
  );
};

export default MainApp;