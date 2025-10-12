import axios from 'axios';
import { API_BASE_URL } from '../api/config';

// Create an axios instance with default configuration for admin endpoints
const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`, // Admin API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session authentication
});

// Request interceptor to add authentication token if available
adminApi.interceptors.request.use(
  (config) => {
    // For session authentication, we don't need to add tokens
    // The session cookie will be sent automatically with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin Dashboard
export const getAdminDashboard = () => adminApi.get('/dashboard/');

// User Management (Admin)
export const getAdminUsers = () => adminApi.get('/users/');
export const getAdminUser = (id) => adminApi.get(`/users/${id}/`);
export const createAdminUser = (userData) => adminApi.post('/users/', userData);
export const updateAdminUser = (id, userData) => adminApi.put(`/users/${id}/`, userData);
export const deleteAdminUser = (id) => adminApi.delete(`/users/${id}/`);
export const searchAdminUsers = (query) => adminApi.get(`/users/search/?q=${query}`);
export const activateAdminUser = (id) => adminApi.post(`/users/${id}/activate/`);
export const deactivateAdminUser = (id) => adminApi.post(`/users/${id}/deactivate/`);

// Document Management (Admin)
export const getAdminDocuments = () => adminApi.get('/documents/');
export const getAdminDocument = (id) => adminApi.get(`/documents/${id}/`);
export const createAdminDocument = (documentData) => adminApi.post('/documents/', documentData);
export const updateAdminDocument = (id, documentData) => adminApi.put(`/documents/${id}/`, documentData);
export const deleteAdminDocument = (id) => adminApi.delete(`/documents/${id}/`);
export const searchAdminDocuments = (query) => adminApi.get(`/documents/search/?q=${query}`);
export const getAdminFolderTree = () => adminApi.get('/documents/folder-tree/');
export const manageDocumentPermissions = (id, permissionsData) => adminApi.post(`/documents/${id}/manage-permissions/`, permissionsData);
export const forceUnlockDocument = (id) => adminApi.post(`/documents/${id}/force-unlock/`);

// Types Management (Admin)
export const getAdminDocumentTypes = () => adminApi.get('/types/document-types/');
export const getAdminDocumentType = (id) => adminApi.get(`/types/document-types/${id}/`);
export const createAdminDocumentType = (typeData) => adminApi.post('/types/document-types/create/', typeData);
export const updateAdminDocumentType = (id, typeData) => adminApi.put(`/types/document-types/${id}/update/`, typeData);
export const deleteAdminDocumentType = (id) => adminApi.delete(`/types/document-types/${id}/delete/`);

export const getAdminCorrespondents = () => adminApi.get('/types/correspondents/');
export const getAdminCorrespondent = (id) => adminApi.get(`/types/correspondents/${id}/`);
export const createAdminCorrespondent = (correspondentData) => adminApi.post('/types/correspondents/create/', correspondentData);
export const updateAdminCorrespondent = (id, correspondentData) => adminApi.put(`/types/correspondents/${id}/update/`, correspondentData);
export const deleteAdminCorrespondent = (id) => adminApi.delete(`/types/correspondents/${id}/delete/`);

// Department Management (Admin)
export const getAdminDepartments = () => adminApi.get('/departments/');
export const getAdminDepartment = (id) => adminApi.get(`/departments/${id}/`);
export const createAdminDepartment = (departmentData) => adminApi.post('/departments/', departmentData);
export const updateAdminDepartment = (id, departmentData) => adminApi.put(`/departments/${id}/`, departmentData);
export const deleteAdminDepartment = (id) => adminApi.delete(`/departments/${id}/`);

// Permissions Management (Admin)
export const getGlobalRolePermissions = () => adminApi.get('/permissions/global-role-permissions/');
export const getObjectLevelPermissions = () => adminApi.get('/permissions/object-level-permissions/');

// Workflows Management (Admin)
export const getAdminWorkflows = () => adminApi.get('/workflows/');
export const getAdminWorkflow = (id) => adminApi.get(`/workflows/${id}/`);
export const createAdminWorkflow = (workflowData) => adminApi.post('/workflows/create/', workflowData);
export const updateAdminWorkflow = (id, workflowData) => adminApi.put(`/workflows/${id}/update/`, workflowData);
export const activateAdminWorkflow = (id) => adminApi.post(`/workflows/${id}/activate/`);
export const deactivateAdminWorkflow = (id) => adminApi.post(`/workflows/${id}/deactivate/`);
export const getActiveWorkflows = () => adminApi.get('/workflows/active-workflows/');

// Audit Logs (Admin)
export const getAuditLogs = () => adminApi.get('/audit-logs/');
export const getAuditLog = (id) => adminApi.get(`/audit-logs/${id}/`);
export const searchAuditLogs = (params) => adminApi.get('/audit-logs/search/', { params });
export const exportAuditLogs = () => adminApi.get('/audit-logs/export/');

// System Configuration (Admin)
export const getStorageSettings = () => adminApi.get('/config/storage-settings/');
export const getOcrSettings = () => adminApi.get('/config/ocr-settings/');
export const getEmailSettings = () => adminApi.get('/config/email-settings/');
export const getSecurityPolicies = () => adminApi.get('/config/security-policies/');
export const getIntegrationSettings = () => adminApi.get('/config/integration-settings/');

export default adminApi;