import React from 'react';
import { 
  DashboardIcon, 
  DocumentIcon, 
  InboxIcon, 
  ClockIcon, 
  TagIcon, 
  UserGroupIcon, 
  SettingsIcon,
  MenuIcon,
  SearchIcon,
  LockIcon,
  ReportIcon,
  BackupIcon,
  NotificationIcon,
  FolderIcon,
  ShareIcon,
  StarIcon,
  HeartIcon
} from '../ui/Icons';

const NavLink = ({ icon, label, isActive, count, onClick }) => (
  <a 
    href="#" 
    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span>{label}</span>
    </div>
    {count && (
      <span className={`px-2 py-0.5 text-xs rounded-full ${
        isActive ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'
      }`}>
        {count}
      </span>
    )}
  </a>
);

// Icon mapping for different sidebar items
const getIcon = (iconName) => {
  switch (iconName) {
    case 'dashboard': return <DashboardIcon />;
    case 'document': return <DocumentIcon />;
    case 'inbox': return <InboxIcon />;
    case 'clock': return <ClockIcon />;
    case 'tag': return <TagIcon />;
    case 'user-group': return <UserGroupIcon />;
    case 'settings': return <SettingsIcon />;
    case 'search': return <SearchIcon />;
    case 'lock': return <LockIcon />;
    case 'report': return <ReportIcon />;
    case 'backup': return <BackupIcon />;
    case 'notification': return <NotificationIcon />;
    case 'folder': return <FolderIcon />;
    case 'share': return <ShareIcon />;
    case 'star': return <StarIcon />;
    case 'heart': return <HeartIcon />;
    default: return <DocumentIcon />;
  }
};

// Sidebar configuration based on user roles from REF-Sidebar.txt
const sidebarConfig = {
  'System Administrator': {
    title: '',
    sections: [
      {
        name: 'Home / Dashboard',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }
        ]
      },
      {
        name: 'Documents',
        items: [
          { id: 'my-documents', label: 'My Documents', icon: 'document' },
          { id: 'shared-with-me', label: 'Shared With Me', icon: 'share' },
          { id: 'recent-documents', label: 'Recent Documents', icon: 'clock' },
          { id: 'search', label: 'Search', icon: 'search' },
          { id: 'document-library', label: 'Document Library', icon: 'document' }
        ]
      },
      {
        name: 'Folders',
        items: [
          { id: 'my-folders', label: 'My Folders', icon: 'folder' },
          { id: 'shared-folders', label: 'Shared Folders', icon: 'share' },
          { id: 'all-folders', label: 'All Folders', icon: 'folder' }
        ]
      },
      {
        name: 'Management',
        items: [
          { id: 'user-management', label: 'User Management', icon: 'user-group' },
          { id: 'role-management', label: 'Role Management', icon: 'user-group' },
          { id: 'permission-settings', label: 'Permission Settings', icon: 'settings' },
          { id: 'document-types', label: 'Document Types', icon: 'document' },
          { id: 'tags-correspondents', label: 'Tags & Correspondents', icon: 'tag' }
        ]
      },
      {
        name: 'Tools',
        items: [
          { id: 'version-history', label: 'Version History', icon: 'document' },
          { id: 'file-locking', label: 'File Locking', icon: 'lock' },
          { id: 'notifications', label: 'Notifications', icon: 'notification' },
          { id: 'reports', label: 'Reports', icon: 'report' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ]
      }
    ]
  },
  'Senior Department Head': {
    title: '',
    sections: [
      {
        name: 'Home / Dashboard',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }
        ]
      },
      {
        name: 'Documents',
        items: [
          { id: 'my-documents', label: 'My Documents', icon: 'document' },
          { id: 'shared-with-me', label: 'Shared With Me', icon: 'share' },
          { id: 'recent-documents', label: 'Recent Documents', icon: 'clock' },
          { id: 'search', label: 'Search', icon: 'search' },
          { id: 'document-library', label: 'Document Library', icon: 'document' }
        ]
      },
      {
        name: 'Folders',
        items: [
          { id: 'my-folders', label: 'My Folders', icon: 'folder' },
          { id: 'shared-folders', label: 'Shared Folders', icon: 'share' },
          { id: 'all-folders', label: 'All Folders', icon: 'folder' }
        ]
      },
      {
        name: 'Management',
        items: [
          { id: 'permission-settings', label: 'Permission Settings', icon: 'settings' },
          { id: 'document-types', label: 'Document Types', icon: 'document' },
          { id: 'tags-correspondents', label: 'Tags & Correspondents', icon: 'tag' }
        ]
      },
      {
        name: 'Tools',
        items: [
          { id: 'version-history', label: 'Version History', icon: 'document' },
          { id: 'file-locking', label: 'File Locking', icon: 'lock' },
          { id: 'notifications', label: 'Notifications', icon: 'notification' },
          { id: 'reports', label: 'Reports', icon: 'report' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ]
      }
    ]
  },
  'Department Head': {
    title: '',
    sections: [
      {
        name: 'Home / Dashboard',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }
        ]
      },
      {
        name: 'Documents',
        items: [
          { id: 'my-documents', label: 'My Documents', icon: 'document' },
          { id: 'shared-with-me', label: 'Shared With Me', icon: 'share' },
          { id: 'recent-documents', label: 'Recent Documents', icon: 'clock' },
          { id: 'search', label: 'Search', icon: 'search' },
          { id: 'document-library', label: 'Document Library', icon: 'document' }
        ]
      },
      {
        name: 'Folders',
        items: [
          { id: 'my-folders', label: 'My Folders', icon: 'folder' },
          { id: 'shared-folders', label: 'Shared Folders', icon: 'share' },
          { id: 'all-folders', label: 'All Folders', icon: 'folder' }
        ]
      },
      {
        name: 'Management',
        items: [
          { id: 'permission-settings', label: 'Permission Settings', icon: 'settings' },
          { id: 'document-types', label: 'Document Types', icon: 'document' },
          { id: 'tags-correspondents', label: 'Tags & Correspondents', icon: 'tag' }
        ]
      },
      {
        name: 'Tools',
        items: [
          { id: 'version-history', label: 'Version History', icon: 'document' },
          { id: 'file-locking', label: 'File Locking', icon: 'lock' },
          { id: 'notifications', label: 'Notifications', icon: 'notification' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ]
      }
    ]
  },
  'Employee': {
    title: '',
    sections: [
      {
        name: 'Home / Dashboard',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }
        ]
      },
      {
        name: 'Documents',
        items: [
          { id: 'my-documents', label: 'My Documents', icon: 'document' },
          { id: 'shared-with-me', label: 'Shared With Me', icon: 'share' },
          { id: 'recent-documents', label: 'Recent Documents', icon: 'clock' },
          { id: 'search', label: 'Search', icon: 'search' },
          { id: 'document-library', label: 'Document Library', icon: 'document' }
        ]
      },
      {
        name: 'Folders',
        items: [
          { id: 'my-folders', label: 'My Folders', icon: 'folder' },
          { id: 'shared-folders', label: 'Shared Folders', icon: 'share' }
        ]
      },
      {
        name: 'Tools',
        items: [
          { id: 'version-history', label: 'Version History', icon: 'document' },
          { id: 'file-locking', label: 'File Locking', icon: 'lock' },
          { id: 'notifications', label: 'Notifications', icon: 'notification' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ]
      }
    ]
  }
};

const Sidebar = ({ 
  isOpen, 
  toggle, 
  activeSection, 
  onSectionChange, 
  userRole = 'Employee' // Default to Employee role
}) => {
  // Get the configuration for the current user role
  const config = sidebarConfig[userRole] || sidebarConfig['Employee'];
  
  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggle} 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-600 bg-white shadow-md"
      >
        <MenuIcon />
      </button>

      {/* Sidebar */}
      <aside 
        className={`absolute lg:relative w-64 h-full flex-shrink-0 bg-white border-r border-gray-200 flex-col justify-between transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="overflow-y-auto flex-grow h-full">
          {config.title && (
            <div className="h-16 flex items-center px-4 bg-green-600 text-white">
              <DocumentIcon />
              <span className="ml-3 text-xl font-bold">{config.title}</span>
            </div>
          )}
          <nav className="p-4 space-y-6">
            {config.sections.map((section, index) => (
              <div key={index}>
                <h4 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.name}
                </h4>
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => (
                    <NavLink 
                      key={item.id}
                      icon={getIcon(item.icon)} 
                      label={item.label} 
                      count={item.count}
                      isActive={activeSection === item.id} 
                      onClick={() => onSectionChange(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;