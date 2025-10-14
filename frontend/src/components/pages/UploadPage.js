import React, { useState, useEffect } from 'react';
import { createDocument } from '../../services/api';
import { getFolders } from '../../services/api';
import { getDocumentTypes } from '../../services/api';
import { getCorrespondents } from '../../services/api';
import { getTags } from '../../services/api';
import UploadArea from '../ui/UploadArea';

const UploadPage = () => {
  const [folders, setFolders] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [correspondents, setCorrespondents] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    folder: '',
    document_type: '',
    correspondent: '',
    tags: []
  });

  // Load dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load folders
        const foldersResponse = await getFolders();
        setFolders(foldersResponse.data);
        
        // Load document types
        const typesResponse = await getDocumentTypes();
        setDocumentTypes(typesResponse.data);
        
        // Load correspondents
        const correspondentsResponse = await getCorrespondents();
        setCorrespondents(correspondentsResponse.data);
        
        // Load tags
        const tagsResponse = await getTags();
        setTags(tagsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load upload form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      tags: selectedTags
    }));
  };

  const handleUploadSuccess = () => {
    setSuccess(true);
    // Reset form after successful upload
    setFormData({
      name: '',
      description: '',
      folder: '',
      document_type: '',
      correspondent: '',
      tags: []
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.folder) {
      setError('Please provide at least a name and select a folder.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare form data for submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('folder', formData.folder);
      
      if (formData.document_type) {
        submitData.append('document_type', formData.document_type);
      }
      
      if (formData.correspondent) {
        submitData.append('correspondent', formData.correspondent);
      }
      
      // Add tags
      formData.tags.forEach(tag => {
        submitData.append('tags', tag);
      });
      
      // In a real implementation, we would also append the file here
      // For now, we'll just simulate the upload
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would be:
      // await createDocument(submitData);
      
      handleUploadSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold text-black mb-4">Upload Document</h1>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          Document uploaded successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div>
          <UploadArea onUploadSuccess={handleUploadSuccess} />
        </div>
        
        {/* Document Metadata Form */}
        <div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Document Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Folder *</label>
                <select
                  name="folder"
                  value={formData.folder}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select a folder</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select a document type</option>
                  {documentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correspondent</label>
                <select
                  name="correspondent"
                  value={formData.correspondent}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select a correspondent</option>
                  {correspondents.map(correspondent => (
                    <option key={correspondent.id} value={correspondent.id}>
                      {correspondent.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <select
                  multiple
                  name="tags"
                  value={formData.tags}
                  onChange={handleTagsChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  size="4"
                >
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd on Mac) to select multiple tags</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;