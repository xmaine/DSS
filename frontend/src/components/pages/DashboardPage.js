import React from 'react';
import DocumentTable from '../ui/DocumentTable';

// Mock data - in a real app, this would come from your API
const mockInboxData = [
  { id: 1, created: 'Oct 02, 2025', title: 'Q3 Financial Report', tags: ['Finance', 'Report', 'Urgent'], correspondent: 'Accounting Dept.' },
  { id: 2, created: 'Oct 01, 2025', title: 'New Marketing Campaign Brief', tags: ['Marketing', 'Planning'], correspondent: 'Jane Doe' },
  { id: 3, created: 'Sep 28, 2025', title: 'Scanned HR Onboarding Docs', tags: ['HR', 'Scanned'], correspondent: 'HR Bot' },
  { id: 4, created: 'Sep 25, 2025', title: 'Project Alpha - Technical Specs', tags: ['Engineering', 'Project Alpha'], correspondent: 'John Smith' },
];

const mockRecentData = [
  { id: 5, created: 'Oct 02, 2025', title: 'Q3 Financial Report', tags: ['Finance', 'Report', 'Urgent'], correspondent: 'Accounting Dept.' },
  { id: 6, created: 'Sep 30, 2025', title: 'Client Meeting Minutes', tags: ['Meeting', 'Client X'], correspondent: 'Sarah Lee' },
  { id: 7, created: 'Sep 29, 2025', title: 'Supplier Invoice #INV-1024', tags: ['Invoice', 'Supplier Y'], correspondent: 'Automated System' },
];

// Mock statistics data
const mockStats = {
  inbox: 8,
  total: 84,
  characters: '2,610,849',
  tags: 28,
  correspondents: 7,
  docTypes: 8,
};

const DashboardPage = () => {
  const handleDocumentClick = (document) => {
    console.log('Document clicked:', document);
    // In a real app, this would navigate to the document detail page
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* YouTube-style dashboard with panels */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* Main content area - full width since right sidebar is handled by MainApp */}
        <div className="space-y-4">
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-black">Inbox</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{mockStats.inbox} documents</span>
            </div>
            <DocumentTable title="" data={mockInboxData} onDocumentClick={handleDocumentClick} />
          </div>
          
          <div className="bg-white rounded border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-black">Recently Added</h2>
              <button className="text-xs text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <DocumentTable title="" data={mockRecentData} onDocumentClick={handleDocumentClick} />
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