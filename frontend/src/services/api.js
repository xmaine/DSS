import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // Use relative path to work with proxy
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session authentication
});

// Request interceptor to add authentication token if available
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    // For session authentication, we don't need to add tokens
    // The session cookie will be sent automatically with withCredentials: true
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('API: 401 Unauthorized - Not redirecting to prevent loop');
      // window.location.href = '/login'; // Commented out to prevent redirect loop
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const login = async (credentials) => {
  console.log('Attempting to login with credentials:', credentials);
  try {
    const response = await api.post('/auth/login/', credentials);
    console.log('Login response:', response);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => api.post('/auth/logout/', {}, {
  headers: {
    'X-CSRFToken': getCookie('csrftoken') || '',
  }
});

export const getCurrentUser = async () => {
  try {
    console.log('API: Getting current user');
    const response = await api.get('/auth/me/');
    console.log('API: Current user response:', response);
    return response;
  } catch (error) {
    console.error('API: Error getting current user:', error);
    throw error;
  }
};

// Helper function to get cookie value by name
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Document Management (Non-admin functions for regular users)
export const getDocuments = () => api.get('/documents/');
export const getDocument = (id) => api.get(`/documents/${id}/`);
export const createDocument = (documentData) => api.post('/documents/', documentData);
export const updateDocument = (id, documentData) => api.put(`/documents/${id}/`, documentData);
export const deleteDocument = (id) => api.delete(`/documents/${id}/`);
export const searchDocuments = (query) => api.get(`/documents/search/?q=${query}`);

// Tag Management (Non-admin functions for regular users)
export const getTags = () => api.get('/tags/');
export const getTag = (id) => api.get(`/tags/${id}/`);
export const createTag = (tagData) => api.post('/tags/', tagData);
export const updateTag = (id, tagData) => api.put(`/tags/${id}/`, tagData);
export const deleteTag = (id) => api.delete(`/tags/${id}/`);

// Correspondent Management (Non-admin functions for regular users)
export const getCorrespondents = () => api.get('/correspondents/');
export const getCorrespondent = (id) => api.get(`/correspondents/${id}/`);
export const createCorrespondent = (correspondentData) => api.post('/correspondents/', correspondentData);
export const updateCorrespondent = (id, correspondentData) => api.put(`/correspondents/${id}/`, correspondentData);
export const deleteCorrespondent = (id) => api.delete(`/correspondents/${id}/`);

// Document Type Management (Non-admin functions for regular users)
export const getDocumentTypes = () => api.get('/document_types/');
export const getDocumentType = (id) => api.get(`/document_types/${id}/`);
export const createDocumentType = (documentTypeData) => api.post('/document_types/', documentTypeData);
export const updateDocumentType = (id, documentTypeData) => api.put(`/document_types/${id}/`, documentTypeData);
export const deleteDocumentType = (id) => api.delete(`/document_types/${id}/`);

// Folder Management (Non-admin functions for regular users)
export const getFolders = () => api.get('/folders/');
export const getFolder = (id) => api.get(`/folders/${id}/`);
export const createFolder = (folderData) => api.post('/folders/', folderData);
export const updateFolder = (id, folderData) => api.put(`/folders/${id}/`, folderData);
export const deleteFolder = (id) => api.delete(`/folders/${id}/`);

// Workflow Management (Non-admin functions for regular users)
export const getWorkflows = () => api.get('/workflows/');
export const getWorkflow = (id) => api.get(`/workflows/${id}/`);
export const createWorkflow = (workflowData) => api.post('/workflows/', workflowData);
export const updateWorkflow = (id, workflowData) => api.put(`/workflows/${id}/`, workflowData);
export const deleteWorkflow = (id) => api.delete(`/workflows/${id}/`);

export default api;