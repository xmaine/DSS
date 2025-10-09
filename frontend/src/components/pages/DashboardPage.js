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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-4">
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
        </div>
        
        {/* Right sidebar panels */}
        <div className="space-y-4">
          {/* Statistics panel */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="font-semibold text-black mb-3">Statistics</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex justify-between">
                <span>Documents in inbox:</span>
                <span className="font-medium text-black">{mockStats.inbox}</span>
              </li>
              <li className="flex justify-between">
                <span>Total documents:</span>
                <span className="font-medium text-black">{mockStats.total}</span>
              </li>
              <li className="flex justify-between">
                <span>Total characters:</span>
                <span className="font-medium text-black">{mockStats.characters}</span>
              </li>
              <hr className="border-gray-200 my-2"/>
              <li className="flex justify-between">
                <span>Tags:</span>
                <span className="font-medium text-black">{mockStats.tags}</span>
              </li>
              <li className="flex justify-between">
                <span>Correspondents:</span>
                <span className="font-medium text-black">{mockStats.correspondents}</span>
              </li>
              <li className="flex justify-between">
                <span>Document Types:</span>
                <span className="font-medium text-black">{mockStats.docTypes}</span>
              </li>
            </ul>
          </div>
          
          {/* Quick actions panel */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="font-semibold text-black mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Upload</span>
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
                <span>New Folder</span>
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <span>Share</span>
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>New Doc</span>
              </button>
            </div>
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