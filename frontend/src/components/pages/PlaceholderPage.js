import React from 'react';

const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold text-black mb-4">{title}</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>{description}</p>
            <p className="mt-4">This feature is currently under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;