import React, { useState } from 'react';

const SettingsPage = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    autoSave: true,
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'UTC'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save these preferences to the backend
    console.log('Saving preferences:', preferences);
    alert('Preferences saved successfully!');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">User Preferences</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              name="theme"
              value={preferences.theme}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              name="language"
              value={preferences.language}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Format
            </label>
            <select
              name="dateFormat"
              value={preferences.dateFormat}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Zone
            </label>
            <select
              name="timeZone"
              value={preferences.timeZone}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="CST">Central Time</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="notifications"
              name="notifications"
              type="checkbox"
              checked={preferences.notifications}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
              Enable notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="autoSave"
              name="autoSave"
              type="checkbox"
              checked={preferences.autoSave}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-700">
              Auto-save documents
            </label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;