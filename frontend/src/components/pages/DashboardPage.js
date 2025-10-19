import React, { useState, useEffect } from 'react';
import DocumentTable from '../ui/DocumentTable';
import { getDocuments } from '../../services/api';

const DashboardPage = ({ user }) => {
  const [inboxData, setInboxData] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const [stats, setStats] = useState({
    inbox: 0,
    total: 0,
    characters: '0',
    tags: 0,
    correspondents: 0,
    docTypes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch documents from API
        const response = await getDocuments();
        const documents = response.data;
        
        // Process inbox data (documents shared with user)
        // In a real implementation, this would filter for documents shared with the current user
        const processedInboxData = documents.slice(0, 4).map(doc => ({
          id: doc.id,
          created: new Date(doc.created_at).toLocaleDateString(),
          title: doc.name,
          tags: doc.tags || [],
          correspondent: doc.correspondent_name || doc.uploader_name || 'Unknown'
        }));
        
        // Process recent data (recently added documents)
        const processedRecentData = documents.slice(0, 3).map(doc => ({
          id: doc.id,
          created: new Date(doc.created_at).toLocaleDateString(),
          title: doc.name,
          tags: doc.tags || [],
          correspondent: doc.correspondent_name || doc.uploader_name || 'Unknown'
        }));
        
        // Update stats
        const updatedStats = {
          inbox: processedInboxData.length,
          total: documents.length,
          characters: '0', // Would need to calculate from document content
          tags: 0, // Would need to fetch from tags API
          correspondents: 0, // Would need to fetch from correspondents API
          docTypes: 0, // Would need to fetch from document types API
        };
        
        setInboxData(processedInboxData);
        setRecentData(processedRecentData);
        setStats(updatedStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDocumentClick = (document) => {
    console.log('Document clicked:', document);
    // In a real app, this would navigate to the document detail page
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* YouTube-style dashboard with panels */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* Main content area - full width since right sidebar is handled by MainApp */}
        <div className="space-y-4">
          {/* Welcome Section */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-black">Welcome!</h2>
          </div>

          {/* Department Information - positioned between welcome greeting and other content */}
          {user && user.department && (
            <div className="bg-white rounded border border-gray-200 p-4">
              <p className="text-gray-600">Department | {user.department}</p>
            </div>
          )}
          
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-black">Inbox</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{stats.inbox} documents</span>
            </div>
            <DocumentTable title="" data={inboxData} onDocumentClick={handleDocumentClick} />
          </div>
          
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-black">Recently Added</h2>
              <button className="text-xs text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <DocumentTable title="" data={recentData} onDocumentClick={handleDocumentClick} />
          </div>
          
          {/* Recent activity panel */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="font-semibold text-black mb-3">Recent Activity</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-black">Uploaded Q3 Financial Report</p>
                  <p className="text-xs">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-black">Shared Marketing Brief with team</p>
                  <p className="text-xs">Yesterday</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-black">Updated Project Alpha specs</p>
                  <p className="text-xs">Oct 3, 2025</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;