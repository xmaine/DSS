import React, { useState, useEffect } from 'react';
import { getAdminDashboard, getGlobalRolePermissions } from '../../services/adminApi';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [permissionsData, setPermissionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [retryCount]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboardResponse, permissionsResponse] = await Promise.all([
        getAdminDashboard(),
        getGlobalRolePermissions()
      ]);
      
      setDashboardData(dashboardResponse.data);
      setPermissionsData(permissionsResponse.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(`Failed to fetch dashboard data: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Check if we have the required data
  if (!dashboardData || !permissionsData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          Dashboard data is incomplete. Please try again.
        </div>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* YouTube-style dashboard with panels */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* Main content area - full width since right sidebar is handled by MainApp */}
        <div className="space-y-4">
          {/* System Health Status */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-black">System Health</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-medium text-green-800">Database</h3>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.system_health?.database_status || 'N/A'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-medium text-blue-800">Storage</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData.system_health?.storage_usage || 'N/A'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-medium text-purple-800">Connections</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData.system_health?.active_connections || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Feed */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-black">Recent Activity</h2>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              {dashboardData.recent_activity && dashboardData.recent_activity.length > 0 ? (
                dashboardData.recent_activity.map((activity, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-black">
                        <span className="font-medium">{activity.user}</span> {activity.action} "{activity.item}"
                      </p>
                      <p className="text-xs">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Unknown time'}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No recent activity</li>
              )}
            </ul>
          </div>
          
          {/* Security Alerts */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-black">Security Alerts</h2>
            </div>
            <div className="text-sm text-gray-700">
              <p>No critical security alerts at this time.</p>
              <div className="mt-2 p-2 bg-yellow-50 rounded">
                <p className="text-yellow-700">Regular security audits recommended.</p>
              </div>
            </div>
          </div>
          
          {/* User Statistics */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-black">User Statistics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-black">
                  {dashboardData.user_statistics?.total_users || 0}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-black">
                  {dashboardData.user_statistics?.active_users || 0}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Users by Role</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {dashboardData.user_statistics?.users_by_role ? (
                  Object.entries(dashboardData.user_statistics.users_by_role).map(([role, count]) => (
                    <li key={role} className="flex justify-between">
                      <span>{role.replace('_', ' ')}</span>
                      <span className="font-medium">{count}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No user role data available</li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Document Statistics */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="font-semibold text-black mb-3">Document Statistics</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex justify-between">
                <span>Total documents:</span>
                <span className="font-medium text-black">
                  {dashboardData.document_statistics?.total_documents || 0}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Storage consumed:</span>
                <span className="font-medium text-black">
                  {dashboardData.document_statistics?.storage_consumed || 0} bytes
                </span>
              </li>
            </ul>
            
            <div className="mt-3">
              <h4 className="font-medium text-gray-700 mb-2">Documents by Type</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {dashboardData.document_statistics?.documents_by_type ? (
                  Object.entries(dashboardData.document_statistics.documents_by_type).map(([type, count]) => (
                    <li key={type} className="flex justify-between">
                      <span>{type}</span>
                      <span className="font-medium">{count}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No document type data available</li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Global Role Permissions */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="font-semibold text-black mb-3">Global Role Permissions</h3>
            <div className="space-y-3">
              {permissionsData ? (
                Object.entries(permissionsData).map(([role, permissions]) => (
                  <div key={role}>
                    <h4 className="font-medium text-gray-700 mb-1">
                      {role.replace('_', ' ')}
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {Object.entries(permissions).map(([permission, value]) => (
                        <li key={permission} className="flex justify-between">
                          <span>{permission.replace(/_/g, ' ')}</span>
                          <span className={value ? 'text-green-600' : 'text-red-600'}>
                            {value ? '✓' : '✗'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No permissions data available</p>
              )}
            </div>
          </div>
          
          {/* System Usage */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="font-semibold text-black mb-3">System Usage</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage Usage</span>
                  <span>{dashboardData.system_health?.storage_usage || '0%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: dashboardData.system_health?.storage_usage || '0%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active Users</span>
                  <span>{dashboardData.user_statistics?.active_users || 0}/{dashboardData.user_statistics?.total_users || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: dashboardData.user_statistics?.total_users ? 
                        `${(dashboardData.user_statistics.active_users / dashboardData.user_statistics.total_users) * 100}%` : 
                        '0%' 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;