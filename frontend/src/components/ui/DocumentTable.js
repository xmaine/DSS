import React from 'react';

const DocumentTable = ({ title, data, onDocumentClick }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    {title && (
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-md font-semibold text-black">{title}</h3>
      </div>
    )}
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correspondent</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data && data.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDocumentClick && onDocumentClick(doc)}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{doc.created}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">{doc.title}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <div className="flex flex-wrap gap-1">
                  {doc.tags && doc.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{doc.correspondent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DocumentTable;