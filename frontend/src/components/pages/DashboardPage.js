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

const DashboardPage = () => {
  const handleDocumentClick = (document) => {
    console.log('Document clicked:', document);
    // In a real app, this would navigate to the document detail page
  };

  return (
    <>
      <DocumentTable title="Inbox" data={mockInboxData} onDocumentClick={handleDocumentClick} />
      <DocumentTable title="Recently Added" data={mockRecentData} onDocumentClick={handleDocumentClick} />
    </>
  );
};

export default DashboardPage;