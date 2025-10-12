import React, { useState, useEffect } from 'react';
import { getAdminDocumentTypes, createAdminDocumentType, updateAdminDocumentType, deleteAdminDocumentType } from '../../services/adminApi';

const DocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Document Formats state - expanded with all MS Office formats
  const [documentFormats, setDocumentFormats] = useState([
    // PDF Formats
    { id: 1, name: 'PDF', extension: '.pdf', mimeType: 'application/pdf', enabled: true },
    
    // MS Word Formats
    { id: 2, name: 'Word Document', extension: '.doc', mimeType: 'application/msword', enabled: true },
    { id: 3, name: 'Word Document (OpenXML)', extension: '.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', enabled: true },
    { id: 4, name: 'Word Template', extension: '.dot', mimeType: 'application/msword', enabled: false },
    { id: 5, name: 'Word Template (OpenXML)', extension: '.dotx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', enabled: false },
    { id: 6, name: 'Word Macro-Enabled Document', extension: '.docm', mimeType: 'application/vnd.ms-word.document.macroEnabled.12', enabled: false },
    { id: 7, name: 'Word Macro-Enabled Template', extension: '.dotm', mimeType: 'application/vnd.ms-word.template.macroEnabled.12', enabled: false },
    
    // MS Excel Formats
    { id: 8, name: 'Excel Spreadsheet', extension: '.xls', mimeType: 'application/vnd.ms-excel', enabled: true },
    { id: 9, name: 'Excel Spreadsheet (OpenXML)', extension: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', enabled: true },
    { id: 10, name: 'Excel Template', extension: '.xlt', mimeType: 'application/vnd.ms-excel', enabled: false },
    { id: 11, name: 'Excel Template (OpenXML)', extension: '.xltx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', enabled: false },
    { id: 12, name: 'Excel Macro-Enabled Spreadsheet', extension: '.xlsm', mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12', enabled: false },
    { id: 13, name: 'Excel Macro-Enabled Template', extension: '.xltm', mimeType: 'application/vnd.ms-excel.template.macroEnabled.12', enabled: false },
    { id: 14, name: 'Excel Binary Workbook', extension: '.xlsb', mimeType: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12', enabled: false },
    { id: 15, name: 'Excel Add-In', extension: '.xla', mimeType: 'application/vnd.ms-excel.addin.macroEnabled.12', enabled: false },
    { id: 16, name: 'Excel Add-In (OpenXML)', extension: '.xlam', mimeType: 'application/vnd.ms-excel.addin.macroEnabled.12', enabled: false },
    
    // MS PowerPoint Formats
    { id: 17, name: 'PowerPoint Presentation', extension: '.ppt', mimeType: 'application/vnd.ms-powerpoint', enabled: true },
    { id: 18, name: 'PowerPoint Presentation (OpenXML)', extension: '.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', enabled: true },
    { id: 19, name: 'PowerPoint Template', extension: '.pot', mimeType: 'application/vnd.ms-powerpoint', enabled: false },
    { id: 20, name: 'PowerPoint Template (OpenXML)', extension: '.potx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.template', enabled: false },
    { id: 21, name: 'PowerPoint Slideshow', extension: '.pps', mimeType: 'application/vnd.ms-powerpoint', enabled: false },
    { id: 22, name: 'PowerPoint Slideshow (OpenXML)', extension: '.ppsx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', enabled: false },
    { id: 23, name: 'PowerPoint Macro-Enabled Presentation', extension: '.pptm', mimeType: 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', enabled: false },
    { id: 24, name: 'PowerPoint Macro-Enabled Template', extension: '.potm', mimeType: 'application/vnd.ms-powerpoint.template.macroEnabled.12', enabled: false },
    { id: 25, name: 'PowerPoint Macro-Enabled Slideshow', extension: '.ppsm', mimeType: 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12', enabled: false },
    
    // Text Formats
    { id: 26, name: 'Text File', extension: '.txt', mimeType: 'text/plain', enabled: true },
    { id: 27, name: 'Rich Text Format', extension: '.rtf', mimeType: 'application/rtf', enabled: true },
    
    // Image Formats
    { id: 28, name: 'JPEG Image', extension: '.jpg', mimeType: 'image/jpeg', enabled: true },
    { id: 29, name: 'JPEG Image', extension: '.jpeg', mimeType: 'image/jpeg', enabled: true },
    { id: 30, name: 'PNG Image', extension: '.png', mimeType: 'image/png', enabled: true },
    { id: 31, name: 'GIF Image', extension: '.gif', mimeType: 'image/gif', enabled: false },
    { id: 32, name: 'TIFF Image', extension: '.tiff', mimeType: 'image/tiff', enabled: false },
    { id: 33, name: 'TIFF Image', extension: '.tif', mimeType: 'image/tiff', enabled: false },
    { id: 34, name: 'Bitmap Image', extension: '.bmp', mimeType: 'image/bmp', enabled: false }
  ]);
  const [showFormatForm, setShowFormatForm] = useState(false);
  const [editingFormat, setEditingFormat] = useState(null);
  const [formatFormData, setFormatFormData] = useState({
    name: '',
    extension: '',
    mimeType: ''
  });

  // Tab state
  const [activeTab, setActiveTab] = useState('documentTypes'); // 'documentTypes' or 'documentFormats'

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      const response = await getAdminDocumentTypes();
      setDocumentTypes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch document types');
      console.error('Error fetching document types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await updateAdminDocumentType(editingType.id, formData);
      } else {
        await createAdminDocumentType(formData);
      }
      fetchDocumentTypes();
      resetForm();
    } catch (err) {
      setError('Failed to save document type');
      console.error('Error saving document type:', err);
    }
  };

  const handleEdit = (docType) => {
    setEditingType(docType);
    setFormData({
      name: docType.name,
      description: docType.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document type?')) {
      try {
        await deleteAdminDocumentType(id);
        fetchDocumentTypes();
      } catch (err) {
        setError('Failed to delete document type');
        console.error('Error deleting document type:', err);
      }
    }
  };

  const resetForm = () => {
    setEditingType(null);
    setFormData({
      name: '',
      description: ''
    });
    setShowForm(false);
  };

  // Document Formats handlers
  const handleFormatInputChange = (e) => {
    const { name, value } = e.target;
    setFormatFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormatSubmit = (e) => {
    e.preventDefault();
    if (editingFormat) {
      // Update existing format
      setDocumentFormats(prev => prev.map(format => 
        format.id === editingFormat.id 
          ? { ...format, ...formatFormData }
          : format
      ));
    } else {
      // Add new format
      const newFormat = {
        id: documentFormats.length + 1,
        ...formatFormData,
        enabled: false // New formats are disabled by default
      };
      setDocumentFormats(prev => [...prev, newFormat]);
    }
    resetFormatForm();
  };

  const handleFormatToggle = (id) => {
    setDocumentFormats(prev => prev.map(format => 
      format.id === id 
        ? { ...format, enabled: !format.enabled }
        : format
    ));
  };

  const handleFormatEdit = (format) => {
    setEditingFormat(format);
    setFormatFormData({
      name: format.name,
      extension: format.extension,
      mimeType: format.mimeType
    });
    setShowFormatForm(true);
  };

  const handleFormatDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document format?')) {
      setDocumentFormats(prev => prev.filter(format => format.id !== id));
    }
  };

  const resetFormatForm = () => {
    setEditingFormat(null);
    setFormatFormData({
      name: '',
      extension: '',
      mimeType: ''
    });
    setShowFormatForm(false);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-700">Loading document types...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('documentTypes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documentTypes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Document Types
          </button>
          <button
            onClick={() => setActiveTab('documentFormats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documentFormats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Document Formats
          </button>
        </nav>
      </div>

      {/* Document Types Tab */}
      {activeTab === 'documentTypes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Document Types</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add New Type
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {showForm ? (
            <div className="mb-6 p-4 border border-gray-200 rounded">
              <h3 className="text-lg font-medium mb-4">
                {editingType ? 'Edit Document Type' : 'Add New Document Type'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    {editingType ? 'Update Type' : 'Create Type'}
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentTypes.map((docType) => (
                  <tr key={docType.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {docType.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {docType.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(docType)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(docType.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Document Formats Tab */}
      {activeTab === 'documentFormats' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Document Formats</h2>
            <button
              onClick={() => setShowFormatForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add New Format
            </button>
          </div>

          {showFormatForm ? (
            <div className="mb-6 p-4 border border-gray-200 rounded">
              <h3 className="text-lg font-medium mb-4">
                {editingFormat ? 'Edit Document Format' : 'Add New Document Format'}
              </h3>
              <form onSubmit={handleFormatSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formatFormData.name}
                    onChange={handleFormatInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extension *
                  </label>
                  <input
                    type="text"
                    name="extension"
                    value={formatFormData.extension}
                    onChange={handleFormatInputChange}
                    required
                    placeholder=".pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MIME Type *
                  </label>
                  <input
                    type="text"
                    name="mimeType"
                    value={formatFormData.mimeType}
                    onChange={handleFormatInputChange}
                    required
                    placeholder="application/pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetFormatForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    {editingFormat ? 'Update Format' : 'Add Format'}
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Extension
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MIME Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentFormats.map((format) => (
                  <tr key={format.id} className={format.enabled ? '' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format.extension}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format.mimeType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleFormatToggle(format.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          format.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            format.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="ml-2 text-sm text-gray-500">
                        {format.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleFormatEdit(format)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleFormatDelete(format.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTypes;