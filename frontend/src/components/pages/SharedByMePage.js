import React, { useState, useEffect } from 'react';
import { getSharedByMe } from '../../services/api';

const SharedByMePage = () => {
  const [sharedItems, setSharedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedItems = async () => {
      try {
        setLoading(true);
        // Fetch items shared by the current user
        const response = await getSharedByMe();
        
        // Process shared items to match the expected format
        const processedItems = response.data.map(item => ({
          id: item.id,
          created: new Date(item.created_at).toLocaleDateString(),
          title: item.name,
          type: item.type,
          sharedWith: item.shared_with || 'Unknown',
          permission: item.permission_codes ? item.permission_codes.join(', ') : 'VIEW'
        }));
        
        setSharedItems(processedItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching shared items:', err);
        setError('Failed to fetch shared items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItems();
  }, []);

  const handleItemClick = (item) => {
    console.log('Viewing shared item:', item);
    // In a real app, this would navigate to the item detail page
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p>Loading shared items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Shared Items</option>
            <option>Documents</option>
            <option>Folders</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
            Share Item
          </button>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">About Shared Items</h3>
        <p className="text-sm text-gray-600">
          These are documents and folders that you have shared with other users. You can manage sharing permissions and revoke access if needed.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shared With</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Shared</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sharedItems.length > 0 ? (
              sharedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sharedWith}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.permission}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleItemClick(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No items shared yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SharedByMePage;