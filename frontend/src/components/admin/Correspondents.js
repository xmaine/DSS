import React, { useState, useEffect } from 'react';
import { getAdminCorrespondents, createAdminCorrespondent, updateAdminCorrespondent, deleteAdminCorrespondent } from '../../services/adminApi';

const Correspondents = () => {
  const [correspondents, setCorrespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCorrespondent, setEditingCorrespondent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCorrespondents();
  }, []);

  const fetchCorrespondents = async () => {
    try {
      setLoading(true);
      const response = await getAdminCorrespondents();
      setCorrespondents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch correspondents');
      console.error('Error fetching correspondents:', err);
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
      if (editingCorrespondent) {
        await updateAdminCorrespondent(editingCorrespondent.id, formData);
      } else {
        await createAdminCorrespondent(formData);
      }
      fetchCorrespondents();
      resetForm();
    } catch (err) {
      setError('Failed to save correspondent');
      console.error('Error saving correspondent:', err);
    }
  };

  const handleEdit = (correspondent) => {
    setEditingCorrespondent(correspondent);
    setFormData({
      name: correspondent.name,
      description: correspondent.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this correspondent?')) {
      try {
        await deleteAdminCorrespondent(id);
        fetchCorrespondents();
      } catch (err) {
        setError('Failed to delete correspondent');
        console.error('Error deleting correspondent:', err);
      }
    }
  };

  const resetForm = () => {
    setEditingCorrespondent(null);
    setFormData({
      name: '',
      description: ''
    });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-700">Loading correspondents...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Correspondents</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Add New Correspondent
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
            {editingCorrespondent ? 'Edit Correspondent' : 'Add New Correspondent'}
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
                {editingCorrespondent ? 'Update Correspondent' : 'Create Correspondent'}
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
            {correspondents.map((correspondent) => (
              <tr key={correspondent.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {correspondent.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {correspondent.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(correspondent)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(correspondent.id)}
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
  );
};

export default Correspondents;