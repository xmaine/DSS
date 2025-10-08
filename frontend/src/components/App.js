import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import { SearchIcon, UserCircleIcon, MenuIcon, NotificationIcon, DashboardIcon, DocumentIcon, FolderIcon, SettingsIcon } from './ui/Icons';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('Employee'); // Default to Employee role

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); // Close sidebar on mobile when selecting a section
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real app, this would call your search API
  };

  const handleRoleChange = (role) => {
    setUserRole(role);
    // Reset to dashboard when changing roles
    setActiveSection('dashboard');
  };

  const renderActivePage = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'my-documents':
      case 'shared-with-me':
      case 'recent-documents':
      case 'document-library':
        return <DocumentsPage />;
      case 'my-folders':
      case 'shared-folders':
      case 'all-folders':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Folder management page will be implemented here.</p>
          </div>
        );
      case 'user-management':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>User management page will be implemented here.</p>
          </div>
        );
      case 'role-management':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Role management page will be implemented here.</p>
          </div>
        );
      case 'permission-settings':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Permission settings page will be implemented here.</p>
          </div>
        );
      case 'document-types':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Document types page will be implemented here.</p>
          </div>
        );
      case 'tags-correspondents':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Tags and correspondents page will be implemented here.</p>
          </div>
        );
      case 'version-history':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Version history page will be implemented here.</p>
          </div>
        );
      case 'file-locking':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>File locking page will be implemented here.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Notifications page will be implemented here.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Reports page will be implemented here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Settings page will be implemented here.</p>
          </div>
        );
      case 'upload-document':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Upload document page will be implemented here.</p>
          </div>
        );
      case 'create-folder':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Create folder page will be implemented here.</p>
          </div>
        );
      case 'share-document':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Share document page will be implemented here.</p>
          </div>
        );
      case 'rate-document':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Rate document page will be implemented here.</p>
          </div>
        );
      case 'link-document':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Link document page will be implemented here.</p>
          </div>
        );
      case 'search':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p>Search page will be implemented here.</p>
          </div>
        );
      default:
        return <DashboardPage />;
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
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setSidebarOpen(!isSidebarOpen)} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        userRole={userRole}
      />
      
      <main className="flex-1 flex flex-col w-full overflow-y-auto">
        {/* --- Header --- */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center flex-grow">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden mr-4 text-gray-600"
            >
              <MenuIcon />
            </button>
            <h1 className="text-xl font-bold text-gray-800 mr-6 hidden sm:block">Document Solutions</h1>
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Search documents..." 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
          <div className="flex items-center space-x-4 ml-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => handleSectionChange('notifications')}
                className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <NotificationIcon />
              </button>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
            </div>
            
            {/* Role selector for demonstration */}
            <select 
              value={userRole} 
              onChange={(e) => handleRoleChange(e.target.value)}
              className="hidden lg:block text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <span className="text-sm font-medium text-gray-700 mr-3 hidden sm:block">Hello, User</span>
            <UserCircleIcon />
          </div>
        </header>

        {/* --- Navigation Menu --- */}
        <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center px-4 sm:px-6 flex-shrink-0">
          <nav className="flex space-x-6">
            <button 
              onClick={() => handleSectionChange('dashboard')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === 'dashboard' 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <DashboardIcon className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button 
              onClick={() => handleSectionChange('my-documents')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                ['my-documents', 'shared-with-me', 'recent-documents', 'document-library'].includes(activeSection) 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <DocumentIcon className="h-5 w-5 mr-2" />
              Documents
            </button>
            <button 
              onClick={() => handleSectionChange('my-folders')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                ['my-folders', 'shared-folders', 'all-folders'].includes(activeSection) 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FolderIcon className="h-5 w-5 mr-2" />
              Folders
            </button>
            <button 
              onClick={() => handleSectionChange('settings')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                ['settings', 'user-management', 'role-management', 'permission-settings', 'document-types', 'tags-correspondents'].includes(activeSection) 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <SettingsIcon className="h-5 w-5 mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* --- Dashboard Content --- */}
        <div className="flex-grow p-4 sm:p-6 lg:flex lg:gap-6">
          <div className="lg:flex-1 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">
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
            </h1>
            {renderActivePage()}
          </div>

          {/* --- Right Sidebar (Info/Actions) --- */}
          {activeSection === 'dashboard' && (
            <div className="w-full lg:w-72 mt-6 lg:mt-0 lg:flex-shrink-0 space-y-6">
              {/* Statistics Panel */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex justify-between">Documents in inbox: <span className="font-medium text-gray-900">8</span></li>
                  <li className="flex justify-between">Total documents: <span className="font-medium text-gray-900">84</span></li>
                  <li className="flex justify-between">Total characters: <span className="font-medium text-gray-900">2,610,849</span></li>
                  <hr className="my-2"/>
                  <li className="flex justify-between">Tags: <span className="font-medium text-gray-900">28</span></li>
                  <li className="flex justify-between">Correspondents: <span className="font-medium text-gray-900">7</span></li>
                  <li className="flex justify-between">Document Types: <span className="font-medium text-gray-900">8</span></li>
                </ul>
              </div>
              
              {/* Document Actions Panel */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Document Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleSectionChange('upload-document')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Upload Document
                  </button>
                  <button 
                    onClick={() => handleSectionChange('create-folder')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                      <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                    </svg>
                    Create Folder
                  </button>
                  {/* Drag and Drop Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-3">
                    <p className="text-sm text-gray-500">Drag and drop documents or folders anywhere</p>
                    <button className="mt-2 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sharing Actions Panel */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Sharing</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleSectionChange('share-document')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    Share Document/Folder
                  </button>
                </div>
              </div>
              
              {/* Document Management Panel */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Document Management</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleSectionChange('rate-document')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Rate Document
                  </button>
                  <button 
                    onClick={() => handleSectionChange('link-document')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 10-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 10-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l-1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    Link Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;