import React, { useState, useEffect } from 'react';
import DocumentTable from '../ui/DocumentTable';

const SharedWithMePage = () => {
  // Mock data - in a real app, this would come from your API
  const mockSharedData = [
    { id: 1, created: 'Oct 02, 2025', title: 'Q3 Financial Report', tags: ['Finance', 'Report', 'Urgent'], correspondent: 'Accounting Dept.', sharedBy: 'John Smith' },
    { id: 2, created: 'Oct 01, 2025', title: 'New Marketing Campaign Brief', tags: ['Marketing', 'Planning'], correspondent: 'Jane Doe', sharedBy: 'Marketing Team' },
    { id: 3, created: 'Sep 28, 2025', title: 'Scanned HR Onboarding Docs', tags: ['HR', 'Scanned'], correspondent: 'HR Bot', sharedBy: 'HR Department' },
    { id: 4, created: 'Sep 25, 2025', title: 'Project Alpha - Technical Specs', tags: ['Engineering', 'Project Alpha'], correspondent: 'John Smith', sharedBy: 'Engineering Team' },
  ];

  const handleDocumentClick = (document) => {
    console.log('Viewing shared document:', document);
    // In a real app, this would navigate to the document detail page
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Shared With Me</h2>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Shared Documents</option>
            <option>Shared by Me</option>
            <option>Recently Shared</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
            Share Document
          </button>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">About Shared Documents</h3>
        <p className="text-sm text-gray-600">
          These are documents that other users have shared with you. You can view, download, and in some cases edit these documents based on the permissions granted by the sharer.
        </p>
      </div>
      
      <DocumentTable 
        title="Shared Documents" 
        data={mockSharedData} 
        onDocumentClick={handleDocumentClick} 
      />
    </div>
  );
};

export default SharedWithMePage;