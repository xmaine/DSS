import React, { useState } from 'react';
import Tags from './Tags';
import Correspondents from './Correspondents';

const TagsCorrespondents = () => {
  const [activeTab, setActiveTab] = useState('tags');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tags')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tags'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tags
          </button>
          <button
            onClick={() => setActiveTab('correspondents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'correspondents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Correspondents
          </button>
        </nav>
      </div>

      {/* Tags Tab Content */}
      {activeTab === 'tags' && <Tags />}

      {/* Correspondents Tab Content */}
      {activeTab === 'correspondents' && <Correspondents />}
    </div>
  );
};

export default TagsCorrespondents;