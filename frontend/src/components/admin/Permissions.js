import React, { useState, useEffect } from 'react';
import { getGlobalRolePermissions } from '../../services/adminApi';

const Permissions = () => {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editablePermissions, setEditablePermissions] = useState({});

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await getGlobalRolePermissions();
      setPermissions(response.data);
      setEditablePermissions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch permissions');
      console.error('Error fetching permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (role, permission) => {
    setEditablePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission]
      }
    }));
  };

  const handleSave = () => {
    // In a real implementation, this would save the permissions to the backend
    alert('Permissions saved successfully!');
    setPermissions(editablePermissions);
  };

  const handleReset = () => {
    setEditablePermissions(permissions);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-700">Loading permissions...</p>
      </div>
    );
  }

  // Define the permissions in order
  const permissionKeys = [
    'can_create_folders',
    'can_upload_documents',
    'can_edit_documents',
    'can_delete_documents',
    'can_manage_users',
    'can_manage_permissions',
    'can_view_audit_logs',
    'can_manage_workflows',
    'can_configure_system'
  ];

  // Define role display names
  const roleNames = {
    'ADMIN': 'System Administrator',
    'SENIOR_DEPT_HEAD': 'Senior Department Head',
    'DEPT_HEAD': 'Department Head',
    'EMPLOYEE': 'Employee'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Global Role Permissions</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Permissions
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              {Object.keys(editablePermissions).map((role) => (
                <th key={role} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {roleNames[role] || role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissionKeys.map((permission) => (
              <tr key={permission}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {permission.replace(/_/g, ' ')}
                </td>
                {Object.keys(editablePermissions).map((role) => (
                  <td key={`${role}-${permission}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editablePermissions[role]?.[permission] || false}
                        onChange={() => handlePermissionChange(role, permission)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Note</h3>
        <p className="text-sm text-blue-700">
          This is a demonstration interface for managing global role permissions. 
          In a production environment, changes would be saved to the backend system.
        </p>
      </div>
    </div>
  );
};

export default Permissions;