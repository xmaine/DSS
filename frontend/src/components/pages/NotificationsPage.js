import React, { useState, useEffect } from 'react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Document Shared', message: 'John Doe shared "Q3 Financial Report" with you', time: '2 hours ago', read: false },
    { id: 2, title: 'Workflow Update', message: 'Your document approval workflow has been completed', time: '1 day ago', read: true },
    { id: 3, title: 'System Maintenance', message: 'Scheduled maintenance will occur this weekend', time: '2 days ago', read: true },
    { id: 4, title: 'New Document', message: 'A new document has been added to your department folder', time: '3 days ago', read: false },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <button 
          onClick={markAllAsRead}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Mark All as Read
        </button>
      </div>
      
      <div className="space-y-4">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
          >
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-800">{notification.title}</h3>
              <span className="text-sm text-gray-500">{notification.time}</span>
            </div>
            <p className="mt-2 text-gray-600">{notification.message}</p>
            {!notification.read && (
              <button 
                onClick={() => markAsRead(notification.id)}
                className="mt-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;