import React, { useState, useEffect } from 'react';

const EmployeeDashboardPage = () => {
  // Mock data - in a real app, this would come from your API
  const [pendingTasks, setPendingTasks] = useState([
    { id: 1, document: 'Q3 Financial Report', task: 'Review & Approve', assignedBy: 'John Smith', dueDate: '2025-10-20' },
    { id: 2, document: 'Marketing Campaign Brief', task: 'Provide Feedback', assignedBy: 'Jane Doe', dueDate: '2025-10-18' },
    { id: 3, document: 'Project Alpha Specs', task: 'Technical Review', assignedBy: 'Engineering Lead', dueDate: '2025-10-17' }
  ]);

  const [recentDocuments, setRecentDocuments] = useState([
    { id: 1, name: 'Q3 Financial Report', folder: 'Finance Documents', lastModified: '2025-10-15' },
    { id: 2, name: 'Marketing Campaign Brief', folder: 'Marketing Docs', lastModified: '2025-10-14' },
    { id: 3, name: 'Project Alpha Specs', folder: 'Engineering', lastModified: '2025-10-13' },
    { id: 4, name: 'HR Onboarding Docs', folder: 'HR Department', lastModified: '2025-10-12' }
  ]);

  const [recentUploads, setRecentUploads] = useState([
    { id: 1, name: 'Team Meeting Notes', created: '2025-10-15', type: 'Document' },
    { id: 2, name: 'Project Update', created: '2025-10-14', type: 'Report' },
    { id: 3, name: 'Expense Report', created: '2025-10-12', type: 'Spreadsheet' }
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'System Maintenance Scheduled', excerpt: 'Maintenance will occur this weekend. Plan accordingly.' },
    { id: 2, title: 'New Document Types Available', excerpt: 'We\'ve added new document types for better categorization.' }
  ]);

  const handleTaskAction = (taskId, action) => {
    console.log(`Performing ${action} on task ${taskId}`);
    // In a real app, this would call your API
  };

  const handleViewDocument = (documentId) => {
    console.log(`Viewing document ${documentId}`);
    // In a real app, this would navigate to the document
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, Employee!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your documents and tasks today.</p>
      </div>

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