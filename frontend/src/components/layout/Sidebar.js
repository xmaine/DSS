import React, { useState } from 'react';
import { 
  DashboardIcon, 
  DocumentIcon, 
  InboxIcon, 
  ClockIcon, 
  TagIcon, 
  UserGroupIcon, 
  SettingsIcon,
  SearchIcon,
  LockIcon,
  ReportIcon,
  BackupIcon,
  NotificationIcon,
  FolderIcon,
  ShareIcon,
  StarIcon,
  HeartIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '../ui/Icons';

const NavLink = ({ icon, label, isActive, count, onClick, isCollapsed }) => (
  <button 
    className={`flex items-center justify-between px-3 py-2 text-sm rounded transition-colors w-full text-left ${
      isActive ? 'bg-gray-200 text-black font-medium' : 'text-gray-700 hover:bg-gray-100'
    }`}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    <div className="flex items-center space-x-3">
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </div>
    {!isCollapsed && count && (
      <span className={`px-2 py-0.5 text-xs rounded-full ${
        isActive ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-700'
      }`}>
        {count}
      </span>
    )}
  </button>
);

// Collapsible section component for YouTube-style sidebar
const CollapsibleSection = ({ title, children, defaultOpen = true, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // When sidebar is collapsed, we want sections to be closed
  // When sidebar expands, restore the default open state
  React.useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    } else {
      setIsOpen(defaultOpen);
    }
  }, [isCollapsed, defaultOpen]);
  
  // In collapsed mode, don't show the section title or collapsible functionality
  if (isCollapsed) {
    return <div className="space-y-1">{children}</div>;
  }
  
  return (
    <div className="mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-100 rounded"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

// Icon mapping for different sidebar items
const getIcon = (iconName) => {
  switch (iconName) {
    case 'dashboard': return <DashboardIcon className="w-5 h-5" />;
    case 'document': return <DocumentIcon className="w-5 h-5" />;
    case 'inbox': return <InboxIcon className="w-5 h-5" />;
    case 'clock': return <ClockIcon className="w-5 h-5" />;
    case 'tag': return <TagIcon className="w-5 h-5" />;
    case 'user-group': return <UserGroupIcon className="w-5 h-5" />;
    case 'settings': return <SettingsIcon className="w-5 h-5" />;
    case 'search': return <SearchIcon className="w-5 h-5" />;
    case 'lock': return <LockIcon className="w-5 h-5" />;
    case 'report': return <ReportIcon className="w-5 h-5" />;
    case 'backup': return <BackupIcon className="w-5 h-5" />;
    case 'notification': return <NotificationIcon className="w-5 h-5" />;
    case 'folder': return <FolderIcon className="w-5 h-5" />;
    case 'share': return <ShareIcon className="w-5 h-5" />;
    case 'star': return <StarIcon className="w-5 h-5" />;
    case 'heart': return <HeartIcon className="w-5 h-5" />;
    default: return <DocumentIcon className="w-5 h-5" />;
  }
};

// Sidebar configuration based on user roles from SidebarOpt.txt
const sidebarConfig = {
  'System Administrator': {
    title: '',
    sections: [
      {
        name: 'Home/Dashboard',
        items: [
          { id: 'dashboard', label: 'Dash', icon: 'dashboard' }
        ]
      },
      {
        name: 'Navigation',
        items: [
          { id: 'my-documents', label: 'Files', icon: 'document' },
          { id: 'user-management', label: 'Users', icon: 'user-group' },
          { id: 'document-types', label: 'Types', icon: 'document' },
          { id: 'permission-settings', label: 'Perms', icon: 'settings' },
          { id: 'workflows', label: 'Workflows', icon: 'backup' },
          { id: 'audit-logs', label: 'Logs', icon: 'report' },
          { id: 'system-config', label: 'Config', icon: 'settings' }
        ]
      }
    ]
  },
  'Senior Department Head': {
    title: '',
    sections: [
      {
        name: 'Home/Dashboard',
        items: [
          { id: 'dashboard', label: 'Dash', icon: 'dashboard' }
        ]
      },
      {
        name: 'Navigation',
        items: [
          { id: 'my-documents', label: 'Files', icon: 'document' },
          { id: 'department-users', label: 'DeptUsers', icon: 'user-group' },
          { id: 'workflows', label: 'Workflows', icon: 'backup' },
          { id: 'shared-with-me', label: 'Shared', icon: 'share' },
          { id: 'notifications', label: 'Notifs', icon: 'notification' }
        ]
      }
    ]
  },
  'Department Head': {
    title: '',
    sections: [
      {
        name: 'Home/Dashboard',
        items: [
          { id: 'dashboard', label: 'Dash', icon: 'dashboard' }
        ]
      },
      {
        name: 'Navigation',
        items: [
          { id: 'my-documents', label: 'Files', icon: 'document' },
          { id: 'upload-document', label: 'Upload', icon: 'inbox' },
          { id: 'team-management', label: 'Team', icon: 'user-group' },
          { id: 'workflows', label: 'Workflows', icon: 'backup' },
          { id: 'shared-with-me', label: 'Shared', icon: 'share' },
          { id: 'notifications', label: 'Notifs', icon: 'notification' }
        ]
      }
    ]
  },
  'Employee': {
    title: '',
    sections: [
      {
        name: 'Home/Dashboard',
        items: [
          { id: 'dashboard', label: 'Home', icon: 'dashboard' }
        ]
      },
      {
        name: 'Navigation',
        items: [
          { id: 'my-documents', label: 'Files', icon: 'document' },
          { id: 'upload-document', label: 'Upload', icon: 'inbox' },
          { id: 'my-owned-documents', label: 'MyDocs', icon: 'document' },
          { id: 'shared-with-me', label: 'Shared', icon: 'share' },
          { id: 'workflows', label: 'Workflows', icon: 'backup' },
          { id: 'notifications', label: 'Notifs', icon: 'notification' }
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
  
  // Determine if sidebar is collapsed (not open)
  const isCollapsed = !isOpen;
  
  return (
    <>
      {/* YouTube-style sidebar - hidden by default, collapses when burger icon is toggled */}
      <aside 
        className={`absolute lg:relative h-full flex-shrink-0 bg-white border-r border-gray-200 flex-col transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'w-64' : 'w-16'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto`}
      >
        <div className="p-3">
          {config.title && !isCollapsed && (
            <div className="h-12 flex items-center px-3 bg-red-600 text-white rounded mb-2">
              <DocumentIcon className="w-5 h-5" />
              <span className="ml-2 text-sm font-bold">{config.title}</span>
            </div>
          )}
          <nav className="space-y-1">
            {config.sections.map((section, index) => (
              <CollapsibleSection key={index} title={isCollapsed ? '' : section.name} defaultOpen={!isCollapsed} isCollapsed={isCollapsed}>
                {section.items.map((item) => (
                  <NavLink 
                    key={item.id}
                    icon={getIcon(item.icon)} 
                    label={item.label} 
                    count={item.count}
                    isActive={activeSection === item.id} 
                    onClick={() => onSectionChange(item.id)}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </CollapsibleSection>
            ))}
          </nav>
        </div>
        
        {/* Removed upload, new folder and settings buttons */}
      </aside>
    </>
  );
};

export default Sidebar;