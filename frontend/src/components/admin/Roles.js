import React from 'react';

const Roles = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Role Management</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled
        >
          Add New Role
        </button>
      </div>

      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-700">
          Role management functionality is not yet implemented in the backend API. 
          Roles are currently managed through the user management system.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  System Administrator
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  Full system access with all permissions
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                All permissions
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  Senior Department Head
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  Manages departments and oversees department heads
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Department management, user management within department
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  Department Head
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  Manages team members and documents within their department
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Team management, document management within department
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  Employee
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  Standard user with basic document access
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Document viewing, uploading, and basic operations
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;