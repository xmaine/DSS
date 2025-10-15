import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import RightSidebar from './layout/RightSidebar';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import UsersAndRoles from './admin/UsersAndRoles';
import DocumentTypes from './admin/DocumentTypes';
import TagsCorrespondents from './admin/TagsCorrespondents';
import Permissions from './admin/Permissions';
import AuditLogs from './admin/AuditLogs';
import SystemConfiguration from './admin/SystemConfiguration';
import Workflows from './admin/Workflows';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import SharedWithMePage from './pages/SharedWithMePage';
import ApiDiagnostics from './ApiDiagnostics';
import UploadPage from './pages/UploadPage';
import MyDocumentsPage from './pages/MyDocumentsPage';
import PlaceholderPage from './pages/PlaceholderPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import EmployeeDocumentsPage from './pages/EmployeeDocumentsPage';
import EmployeeWorkflowsPage from './pages/EmployeeWorkflowsPage';
import { 
  SearchIcon, 
  UserCircleIcon, 
  MenuIcon, 
  NotificationIcon, 
  DocumentIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from './ui/Icons';
import { logout } from '../services/api';

const MainApp = ({ onLogout, user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user dropdown menu

  // Map backend role values to frontend role names
  const getFrontendRoleName = (backendRole) => {
    const roleMapping = {
      'ADMIN': 'System Administrator',
      'SENIOR_DEPT_HEAD': 'Senior Department Head',
      'DEPT_HEAD': 'Department Head',
      'EMPLOYEE': 'Employee'
    };
    return roleMapping[backendRole] || 'Employee'; // Default to Employee if not found
  };

  // Get the user's role name for the frontend
  const userRole = user && user.role ? getFrontendRoleName(user.role) : 'Employee';
  
  // Check user role types
  const isSystemAdmin = userRole === 'System Administrator';
  const isSeniorDeptHead = userRole === 'Senior Department Head';
  const isDeptHead = userRole === 'Department Head';
  const isEmployee = userRole === 'Employee';

  const handleSectionChange = (section) => {
    console.log('Section change requested:', section);
    setActiveSection(section);
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
    // Render different components based on the active section
    switch (activeSection) {
      // Dashboard pages
      case 'dashboard':
        return isSystemAdmin ? <AdminDashboardPage /> : (isEmployee ? <EmployeeDashboardPage /> : <DashboardPage />);
      
      // Document pages
      case 'my-documents':
      case 'recent-documents':
      case 'search':
      case 'document-library':
      case 'my-folders':
        return isEmployee ? <EmployeeDocumentsPage /> : <DocumentsPage isAdminView={false} />;
      
      case 'shared-with-me':
        return <SharedWithMePage />;
      
      case 'shared-folders':
      case 'all-folders':
        return <DocumentsPage isAdminView={isSystemAdmin} />;
      
      // User Management pages (System Administrator)
      case 'user-management':
      case 'department-management':
        return isSystemAdmin ? <UsersAndRoles /> : <DashboardPage />;
      
      // Department Management pages (Senior Department Head)
      case 'department-users':
      case 'department-structure':
        return isSeniorDeptHead ? <UsersAndRoles /> : <DashboardPage />;
      
      // Team Management pages (Department Head)
      case 'team-management':
        return isDeptHead ? <UsersAndRoles /> : <DashboardPage />;
      
      // Document configuration pages (System Administrator)
      case 'document-types':
        return isSystemAdmin ? <DocumentTypes /> : <DashboardPage />;
      
      case 'tags-correspondents':
        return isSystemAdmin ? <TagsCorrespondents /> : <DashboardPage />;
      
      case 'permission-settings':
        return isSystemAdmin ? <Permissions /> : <DashboardPage />;
      
      case 'system-config':
        return isSystemAdmin ? <SystemConfiguration /> : <DashboardPage />;
      
      // Workflow pages (different for each role)
      case 'workflows':
        return isSystemAdmin ? <Workflows isAdminView={true} /> : (isEmployee ? <EmployeeWorkflowsPage /> : <Workflows isAdminView={false} />);
      
      // Audit pages (System Administrator)
      case 'audit-logs':
        return isSystemAdmin ? <AuditLogs /> : <DashboardPage />;
      
      // Notification pages
      case 'notifications':
        return <NotificationsPage />;
      
      // Settings page
      case 'settings':
        return <SettingsPage />;
      
      // Upload page
      case 'upload-document':
        return <UploadPage />;
      
      // Placeholder pages for unimplemented features
      case 'role-management':
        return <PlaceholderPage title="Role Management" description="Manage user roles and permissions." />;
      
      case 'reports':
        return <PlaceholderPage title="Reports" description="View system reports and analytics." />;
      
      case 'create-folder':
        return <PlaceholderPage title="Create Folder" description="Create a new folder in the document hierarchy." />;
      
      case 'share-document':
        return <PlaceholderPage title="Share Document" description="Share documents with other users or groups." />;
      
      case 'rate-document':
        return <PlaceholderPage title="Rate Document" description="Rate and review documents." />;
      
      case 'link-document':
        return <PlaceholderPage title="Link Document" description="Create links between related documents." />;
      
      case 'version-history':
        return <PlaceholderPage title="Version History" description="View and manage document version history." />;
      
      case 'file-locking':
        return <PlaceholderPage title="File Locking" description="Manage document locking and unlocking." />;
      
      // API Diagnostics page
      case 'api-diagnostics':
        return <ApiDiagnostics />;
      
      // Default to dashboard if section not recognized
      default:
        return isSystemAdmin ? <AdminDashboardPage /> : <DashboardPage />;
    }
  };

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
          
          {/* Removed menu labels (FILE, EDIT, VIEW, TOOLS, WINDOW, HELP) to give more space for user greetings */}
        </div>
        
        {/* Center the search bar */}
        <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
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
        </div>
        
        <div className="flex items-center space-x-4">
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
          
          {/* User dropdown menu */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="text-sm font-medium text-black whitespace-nowrap">
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
          
          {/* Right Sidebar Toggle Button - Moved to the rightmost position */}
          <button 
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isRightSidebarOpen ? (
              <ChevronRightIcon className="w-6 h-6 text-black" />
            ) : (
              <ChevronLeftIcon className="w-6 h-6 text-black" />
            )}
          </button>
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
                {activeSection === 'dashboard' && 'Home / Dashboard'}
                {activeSection === 'my-documents' && 'Documents'}
                {activeSection === 'shared-with-me' && 'Shared With Me'}
                {activeSection === 'recent-documents' && 'Recent Documents'}
                {activeSection === 'search' && 'Search'}
                {activeSection === 'document-library' && 'Document Library'}
                {activeSection === 'my-folders' && 'My Folders'}
                {activeSection === 'shared-folders' && 'Shared Folders'}
                {activeSection === 'all-folders' && 'All Folders'}
                {activeSection === 'user-management' && 'User Management'}
                {activeSection === 'department-management' && 'Department Management'}
                {activeSection === 'department-users' && 'Departmental User Management'}
                {activeSection === 'department-structure' && 'Departmental Structure'}
                {activeSection === 'team-management' && 'Team User Management'}
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
                {activeSection === 'system-config' && 'System Configuration'}
                {activeSection === 'workflows' && (isSystemAdmin ? 'Workflow Templates' : 
                  (isSeniorDeptHead || isDeptHead) ? 'Workflow Instances' : 'My Workflows')}
                {activeSection === 'audit-logs' && 'Audit Logs'}
                {activeSection === 'my-owned-documents' && 'My Documents'}
                {activeSection === 'api-diagnostics' && 'API Diagnostics'}
              </h1>
            </div>
            {renderActivePage()}
          </div>
        </div>

        {/* --- Right Sidebar --- */}
        {isRightSidebarOpen && (
          <RightSidebar 
            userRole={userRole} 
            isSystemAdmin={isSystemAdmin} 
            activeSection={activeSection}
          />
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