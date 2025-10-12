import React, { useState, useEffect } from 'react';
import { 
  getStorageSettings, 
  getOcrSettings, 
  getEmailSettings, 
  getSecurityPolicies, 
  getIntegrationSettings 
} from '../../services/adminApi';

const SystemConfiguration = () => {
  const [configs, setConfigs] = useState({
    storage: {},
    ocr: {},
    email: {},
    security: {},
    integration: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('storage');

  useEffect(() => {
    fetchAllConfigurations();
  }, []);

  const fetchAllConfigurations = async () => {
    try {
      setLoading(true);
      const [storage, ocr, email, security, integration] = await Promise.all([
        getStorageSettings(),
        getOcrSettings(),
        getEmailSettings(),
        getSecurityPolicies(),
        getIntegrationSettings()
      ]);

      setConfigs({
        storage: storage.data,
        ocr: ocr.data,
        email: email.data,
        security: security.data,
        integration: integration.data
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch system configurations');
      console.error('Error fetching configurations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // In a real implementation, this would save the configurations to the backend
    alert('System configurations saved successfully!');
  };

  const tabs = [
    { id: 'storage', label: 'Storage' },
    { id: 'ocr', label: 'OCR' },
    { id: 'email', label: 'Email' },
    { id: 'security', label: 'Security' },
    { id: 'integration', label: 'Integration' }
  ];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-700">Loading system configurations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">System Configuration</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Configuration
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'storage' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Storage Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Root Path
                </label>
                <input
                  type="text"
                  defaultValue={configs.storage.media_root}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Quota
                </label>
                <input
                  type="text"
                  defaultValue={configs.storage.storage_quota}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Usage
                </label>
                <input
                  type="text"
                  defaultValue={configs.storage.current_usage}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ocr' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">OCR Settings</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tesseract Language Packs
                </label>
                <input
                  type="text"
                  defaultValue={configs.ocr.tesseract_language_packs?.join(', ')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default OCR Behavior
                </label>
                <select
                  defaultValue={configs.ocr.default_ocr_behavior}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="auto">Auto</option>
                  <option value="manual">Manual</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Host
                </label>
                <input
                  type="text"
                  defaultValue={configs.email.smtp_host}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="number"
                  defaultValue={configs.email.smtp_port}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Use TLS
                </label>
                <select
                  defaultValue={configs.email.use_tls}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender Email
                </label>
                <input
                  type="email"
                  defaultValue={configs.email.sender_email}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Security Policies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Minimum Length
                </label>
                <input
                  type="number"
                  defaultValue={configs.security.password_min_length}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Complexity Required
                </label>
                <select
                  defaultValue={configs.security.password_complexity}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (seconds)
                </label>
                <input
                  type="number"
                  defaultValue={configs.security.session_timeout}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MFA Required
                </label>
                <select
                  defaultValue={configs.security.mfa_required}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integration' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Integration Settings</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Keys
                </label>
                <textarea
                  defaultValue={JSON.stringify(configs.integration.api_keys, null, 2)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  External Services
                </label>
                <textarea
                  defaultValue={JSON.stringify(configs.integration.external_services, null, 2)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Note</h3>
        <p className="text-sm text-blue-700">
          This is a demonstration interface for system configuration. 
          In a production environment, changes would be saved to the backend system.
        </p>
      </div>
    </div>
  );
};

export default SystemConfiguration;