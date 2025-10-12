import React from 'react';

const DebugSidebar = ({ activeSection, userRole, onSectionChange }) => {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h2 className="text-lg font-semibold text-yellow-800 mb-2">Sidebar Debug Info</h2>
      <div className="space-y-1 text-sm">
        <p><strong>Active Section:</strong> {activeSection}</p>
        <p><strong>User Role:</strong> {userRole}</p>
        <p><strong>Section Change Handler:</strong> {onSectionChange ? 'Function exists' : 'Missing'}</p>
      </div>
      <div className="mt-3">
        <button 
          onClick={() => onSectionChange('dashboard')}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm mr-2"
        >
          Test Dashboard
        </button>
        <button 
          onClick={() => onSectionChange('user-management')}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Test User Management
        </button>
      </div>
    </div>
  );
};

export default DebugSidebar;