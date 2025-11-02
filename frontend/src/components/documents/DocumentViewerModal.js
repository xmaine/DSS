import React, { useState, useEffect } from 'react';

const DocumentViewerModal = ({ document, onClose, onDownload }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    if (onDownload && document?.current_version_file) {
      onDownload(document.current_version_file);
    }
  };

  const getFileType = (fileName) => {
    if (!fileName) return 'unknown';
    const extension = fileName.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const pdfTypes = ['pdf'];
    const textTypes = ['txt', 'md', 'csv'];
    const docTypes = ['doc', 'docx'];
    const sheetTypes = ['xls', 'xlsx'];
    const presentationTypes = ['ppt', 'pptx'];
    
    if (imageTypes.includes(extension)) return 'image';
    if (pdfTypes.includes(extension)) return 'pdf';
    if (textTypes.includes(extension)) return 'text';
    if (docTypes.includes(extension)) return 'document';
    if (sheetTypes.includes(extension)) return 'spreadsheet';
    if (presentationTypes.includes(extension)) return 'presentation';
    return 'unknown';
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-600">Loading document...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-500 font-medium">Error loading document</p>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </div>
      );
    }

    if (!document?.current_version_file) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-500 text-5xl mb-4">📄</div>
            <p className="text-gray-600">No preview available for this document</p>
          </div>
        </div>
      );
    }

    const fileType = getFileType(document.title);
    
    // For images, show actual image preview
    if (fileType === 'image') {
      return (
        <div className="flex justify-center p-4">
          <img 
            src={document.current_version_file} 
            alt={document.title}
            className="max-w-full max-h-96 object-contain"
            onError={() => setError('Failed to load image preview')}
          />
        </div>
      );
    }

    // For PDFs, show embed
    if (fileType === 'pdf') {
      return (
        <div className="flex justify-center p-4">
          <embed 
            src={document.current_version_file} 
            type="application/pdf"
            className="w-full h-96"
            onError={() => setError('Failed to load PDF preview')}
          />
        </div>
      );
    }

    // For other file types, show file info
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-5xl mb-4">
            {fileType === 'document' && '📝'}
            {fileType === 'spreadsheet' && '📊'}
            {fileType === 'presentation' && '📽️'}
            {fileType === 'text' && '📄'}
            {fileType === 'unknown' && '📁'}
          </div>
          <p className="text-gray-800 font-medium">{document.title}</p>
          <p className="text-gray-600 mt-2">
            {document.file_type || 'Unknown file type'} • 
            {document.current_version?.file_size ? ` ${(document.current_version.file_size / 1024).toFixed(1)} KB` : ' Unknown size'}
          </p>
          <button
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Download File
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-full flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate mr-4">
            {document?.title || 'Document Viewer'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-grow">
          {renderPreview()}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center border-t p-4">
          <div className="text-sm text-gray-600">
            {document?.updated_at ? `Modified: ${new Date(document.updated_at).toLocaleDateString()}` : ''}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            {document?.current_version_file && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;