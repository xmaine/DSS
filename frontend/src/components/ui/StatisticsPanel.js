import React from 'react';

const StatisticsPanel = ({ stats }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
    <ul className="text-sm text-gray-600 space-y-2">
      <li className="flex justify-between">
        Documents in inbox: <span className="font-medium text-gray-900">{stats.inbox || 0}</span>
      </li>
      <li className="flex justify-between">
        Total documents: <span className="font-medium text-gray-900">{stats.total || 0}</span>
      </li>
      <li className="flex justify-between">
        Total characters: <span className="font-medium text-gray-900">{stats.characters || '0'}</span>
      </li>
      <hr className="my-2"/>
      <li className="flex justify-between">
        Tags: <span className="font-medium text-gray-900">{stats.tags || 0}</span>
      </li>
      <li className="flex justify-between">
        Correspondents: <span className="font-medium text-gray-900">{stats.correspondents || 0}</span>
      </li>
      <li className="flex justify-between">
        Document Types: <span className="font-medium text-gray-900">{stats.docTypes || 0}</span>
      </li>
    </ul>
  </div>
);

export default StatisticsPanel;