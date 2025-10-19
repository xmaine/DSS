import React, { useState, useEffect } from 'react';
import { getDocuments } from '../../services/api';

const EmployeeDashboardPage = ({ user }) => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch real documents from the API
        const response = await getDocuments();
        const documents = response.data;
        
        // Process documents for the dashboard
        const recentDocs = documents.slice(0, 4).map(doc => ({
          id: doc.id,
          name: doc.name,
          folder: doc.folder_name || 'Uncategorized',
          lastModified: new Date(doc.updated_at).toLocaleDateString()
        }));
        
        const recentUploadsData = documents.slice(0, 3).map(doc => ({
          id: doc.id,
          name: doc.name,
          created: new Date(doc.created_at).toLocaleDateString(),
          type: doc.document_type_name || 'Document'
        }));
        
        // In a real implementation, these would come from actual workflow tasks
        // For now, we'll have an empty array since we're removing mock data
        const tasks = [];
        
        // Announcements would come from a real API in production
        // For now, we'll have an empty array since we're removing mock data
        const announcementsData = [];
        
        setRecentDocuments(recentDocs);
        setRecentUploads(recentUploadsData);
        setPendingTasks(tasks);
        setAnnouncements(announcementsData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        
        // Set empty arrays on error to avoid showing mock data
        setPendingTasks([]);
        setRecentDocuments([]);
        setRecentUploads([]);
        setAnnouncements([]);
      }
    };

    fetchData();
  }, []);

  const handleTaskAction = async (taskId, action) => {
    console.log(`Performing ${action} on task ${taskId}`);
    // In a real app, this would call your API
    try {
      switch (action) {
        case 'complete':
          // Complete task logic
          break;
        case 'clarification':
          // Request clarification logic
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing ${action} on task ${taskId}:`, error);
    }
  };

  const handleViewDocument = async (documentId) => {
    console.log(`Viewing document ${documentId}`);
    // In a real app, this would navigate to the document
    try {
      // View document logic would go here
      console.log(`View document ${documentId} functionality would be implemented here`);
    } catch (error) {
      console.error(`Error viewing document ${documentId}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-red-500">{error}</p>
        <p className="text-gray-500 mt-2">Error loading dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, Employee!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your documents and tasks today.</p>
      </div>

      {/* Department Information - positioned between welcome greeting and pending tasks */}
      {user && user.department && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600">Department | {user.department}</p>
        </div>
      )}

      {/* Pending Tasks Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Pending Tasks</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        
        {pendingTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.document}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.task}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleTaskAction(task.id, 'complete')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Complete
                      </button>
                      <button 
                        onClick={() => handleTaskAction(task.id, 'clarification')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Request Clarification
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No pending tasks at this time.</p>
        )}
      </div>

      {/* Recently Viewed Documents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Viewed Documents</h2>
        
        {recentDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleViewDocument(doc.id)}
              >
                <h3 className="font-medium text-gray-800">{doc.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{doc.folder}</p>
                <p className="text-xs text-gray-400 mt-2">Last modified: {doc.lastModified}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recently viewed documents.</p>
        )}
      </div>

      {/* Recent Uploads and Announcements - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Recent Uploads</h2>
          
          {recentUploads.length > 0 ? (
            <div className="space-y-3">
              {recentUploads.map((upload) => (
                <div key={upload.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
                  <div>
                    <h3 className="font-medium text-gray-800">{upload.name}</h3>
                    <p className="text-sm text-gray-500">{upload.type}</p>
                  </div>
                  <span className="text-xs text-gray-400">{upload.created}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent uploads.</p>
          )}
        </div>

        {/* System Announcements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Important Announcements</h2>
          
          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{announcement.excerpt}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No announcements at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;