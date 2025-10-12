import React, { useState } from 'react';
import UserManagement from './UserManagement';
import Departments from './Departments';
import Roles from './Roles';

const UsersAndRoles = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'departments', or 'roles'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Tabs - Implementing QFormats #Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600' // Active tab: blue underline and blue text
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive tab
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments'
                ? 'border-blue-500 text-blue-600' // Active tab: blue underline and blue text
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive tab
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-600' // Active tab: blue underline and blue text
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive tab
            }`}
          >
            Roles
          </button>
        </nav>
      </div>

      {/* Users Tab Content */}
      {activeTab === 'users' && <UserManagement />}

      {/* Departments Tab Content */}
      {activeTab === 'departments' && <Departments />}

      {/* Roles Tab Content */}
      {activeTab === 'roles' && <Roles />}
    </div>
  );
};

export default UsersAndRoles;