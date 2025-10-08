import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './api/config';
import './App.css';

// Sidebar component
const Sidebar = ({ isOpen, toggle }) => (
  <div className={`sidebar ${isOpen ? 'open' : ''}`}>
    <div className="sidebar-header">
      <span className="sidebar-logo">DSS</span>
    </div>
    <div className="sidebar-section">
      <div className="sidebar-section-title">LIBRARY</div>
      <a href="#" className="sidebar-link active">
        <span className="sidebar-link-icon">📄</span>
        Inbox
      </a>
      <a href="#" className="sidebar-link">
        <span className="sidebar-link-icon">🕒</span>
        Recent
      </a>
      <a href="#" className="sidebar-link">
        <span className="sidebar-link-icon">🏷️</span>
        Tags
      </a>
    </div>
    <div className="sidebar-section">
      <div className="sidebar-section-title">TAGS</div>
      <a href="#" className="sidebar-link">
        <span className="sidebar-link-icon">🔵</span>
        Important
      </a>
      <a href="#" className="sidebar-link">
        <span className="sidebar-link-icon">🟢</span>
        Work
      </a>
      <a href="#" className="sidebar-link">
        <span className="sidebar-link-icon">🟣</span>
        Personal
      </a>
    </div>
  </div>
);

// Document table component
const DocumentTable = ({ documents, title, onRefresh }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      axios.delete(`${API_BASE_URL}/documents/${id}/`)
        .then(() => {
          onRefresh();
        })
        .catch(error => {
          console.error('Error deleting document:', error);
        });
    }
  };

  return (
    <div className="document-section">
      <div className="document-section-header">
        <h3 className="document-section-title">{title}</h3>
        <a href="#" className="show-all-link">Show all</a>
      </div>
      <table className="document-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Uploaded</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>
                <a href={doc.file} target="_blank" rel="noopener noreferrer">
                  {doc.title}
                </a>
              </td>
              <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
              <td>{doc.description || 'No description'}</td>
              <td>
                <button 
                  className="action-button-secondary"
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Statistics panel component
const StatsPanel = ({ stats }) => (
  <div className="stats-panel">
    <h3 className="stats-header">Statistics</h3>
    <div className="stats-item">
      <span>Total documents</span>
      <span className="stats-value">{stats.total}</span>
    </div>
    <div className="stats-item">
      <span>Inbox</span>
      <span className="stats-value">{stats.inbox}</span>
    </div>
    <div className="stats-item">
      <span>Tags</span>
      <span className="stats-value">{stats.tags}</span>
    </div>
    <div className="stats-item">
      <span>Correspondents</span>
      <span className="stats-value">{stats.correspondents}</span>
    </div>
  </div>
);

// Upload area component
const UploadArea = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    axios.post(`${API_BASE_URL}/documents/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert('Document uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
      onUploadSuccess();
    })
    .catch(error => {
      console.error('Error uploading document:', error);
      alert('Error uploading document');
    });
  };

  return (
    <div className="upload-area">
      <h3 className="upload-title">Upload Document</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', minHeight: '60px' }}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: '8px' }}
            required
          />
        </div>
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
    </div>
  );
};

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/documents/`)
      .then(response => {
        setDocuments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching documents:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <Sidebar isOpen={isSidebarOpen} toggle={setSidebarOpen} />
      <div className="main-content">
        <div className="top-bar">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? 'Close' : 'Open'} Menu
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search documents..."
              className="search-input"
            />
          </div>
          <div className="user-menu">
            <span>User</span>
          </div>
        </div>
        <div className="dashboard">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Document Management System</h1>
            <p className="dashboard-welcome">Welcome to your document management system</p>
          </div>
          
          <div className="dashboard-grid">
            <div>
              <DocumentTable 
                documents={documents} 
                title="All Documents" 
                onRefresh={fetchDocuments}
              />
            </div>
            <div>
              <StatsPanel stats={{
                inbox: documents.length,
                total: documents.length,
                tags: 4,
                correspondents: 0,
                docTypes: 0
              }} />
              <UploadArea onUploadSuccess={fetchDocuments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}