---
---
### TASK.md

```markdown
# DOCUMENT SOLUTIONS Project Tasks

This document outlines the initial tasks for the DOCUMENT SOLUTIONS project, broken down by phase and module, with user role considerations.

## Phase 1: Setup & Core Foundation (MVP)

**Goal:** Establish the basic project structure, user authentication, document upload, storage, and simple retrieval.

### 1.1 Project Setup & Environment (System Administrator Focus)

*   **Backend (Django):**
    *   Initialize Django project and app structure (`document_solutions`, `dms_core`).
    *   Configure PostgreSQL database connection in Django settings.
    *   Set up Django `settings.py` for development (DEBUG, ALLOWED_HOSTS, static/media files).
    *   Implement basic user authentication (Django's built-in `User` model, `authenticate`, `login`, `logout`).
    *   Create `CustomUser` model inheriting from `AbstractUser` to include `role` field (Admin, Senior Department Head, Department Head, Employee).
    *   Implement user registration for System Administrator (manual creation via `createsuperuser` for initial admin).
    *   Create Django REST Framework setup (install, configure serializers, views).
*   **Frontend (React):**
    *   Initialize React project (`create-react-app` or Vite).
    *   Set up basic routing (e.g., Login, Dashboard, Documents).
    *   Integrate Axios for API calls to Django backend.
    *   Develop Login/Logout components.
*   **Development Environment:**
    *   Set up Git repository and initial `.gitignore`.
    *   Create `requirements.txt` for Python dependencies.
    *   Basic Docker setup (optional, but recommended for consistent environments).

### 1.2 User Management & Roles (System Administrator Focus)

*   **Backend (Django):**
    *   Develop Django admin interface for managing `CustomUser` and assigning roles.
    *   Create API endpoints for System Administrator to create/edit/delete users and assign roles.
*   **Frontend (React):**
    *   Develop User Management UI for System Administrator.
    *   Implement role-based visibility for UI elements (e.g., only Admin sees "Manage Users" button).

### 1.3 Core Document Upload & Storage (Employee, Department Head Focus)

*   **Backend (Django):**
    *   Define `Document` model: fields for `name`, `file` (FileField), `uploader` (ForeignKey to CustomUser), `upload_date`, `file_size`, `file_type`.
    *   Configure Django's `MEDIA_ROOT` and `MEDIA_URL` for file storage.
    *   Create API endpoint for document upload (e.g., `/api/documents/upload/`).
    *   Implement file handling to save uploaded files to `MEDIA_ROOT`.
*   **Frontend (React):**
    *   Develop a Document Upload component (drag-and-drop area or file input).
    *   Display upload progress/success messages.

### 1.4 Folder Structure & Navigation (All Users, especially Department Heads)

*   **Backend (Django):**
    *   Define `Folder` model: fields for `name`, `parent_folder` (ForeignKey to self), `owner` (ForeignKey to CustomUser).
    *   Modify `Document` model to include `folder` (ForeignKey to Folder).
    *   Create API endpoints for creating, renaming, deleting folders.
    *   Create API endpoints to list documents and subfolders within a given folder.
*   **Frontend (React):**
    *   Develop Folder Navigation component (sidebar or breadcrumbs).
    *   Implement "Create Folder" functionality.
    *   Display documents and subfolders in the main content area.

### 1.5 Basic Document Listing & Search (All Users)

*   **Backend (Django):**
    *   Create API endpoint to list all documents (filtered by folder).
    *   Implement basic search logic on `Document.name` field.
*   **Frontend (React):**
    *   Display documents in a tabular or card view.
    *   Implement a search bar to filter documents by name.
    *   Display basic document details (name, uploader, upload date).

### 1.6 Embedded PDF Viewer (All Users)

*   **Frontend (React):**
    *   Integrate a PDF viewer library (e.g., `react-pdf`, PDF.js).
    *   Develop a component to display PDF documents by fetching them from the Django `MEDIA_URL`.
*   **Backend (Django):**
    *   Ensure files are served securely and with correct content types.

---

## Phase 2: Enhancements & Collaboration Tools

**Goal:** Add essential features for better organization, collaboration, and version control.

### 2.1 Metadata Management & Indexing (All Users, Admin/Dept Head for custom fields)

*   **Backend (Django):**
    *   Extend `Document` model with fields for `tags` (ManyToManyField or ArrayField), `description`, `document_type` (ForeignKey to a `DocumentType` model), `correspondent` (ForeignKey to a `Correspondent` model).
    *   Implement full-text search using `django.contrib.postgres.search` or a dedicated search engine (e.g., Haystack with Elasticsearch/Whoosh).
    *   Create API endpoints for managing `DocumentType` and `Correspondent` models (Admin/Senior Department Head scope).
*   **Frontend (React):**
    *   Add forms for inputting/editing document metadata during upload and editing.
    *   Enhance search functionality to include metadata fields.

### 2.2 Versioning (All Users, especially those editing)

*   **Backend (Django):**
    *   Implement a `DocumentVersion` model (or use a library like `django-reversion`).
    *   Automatically create a new `DocumentVersion` record upon document modification.
    *   Store historical file data (e.g., by copying the file or using efficient storage strategies).
    *   API endpoints to list versions, retrieve a specific version, and revert to an older version.
*   **Frontend (React):**
    *   Display document version history.
    *   Option to view previous versions.
    *   Button to "Revert to this Version".

### 2.3 File Locking (Users editing documents)

*   **Backend (Django):**
    *   Add `locked_by` (ForeignKey to CustomUser) and `locked_at` (DateTimeField) to `Document` model.
    *   API endpoints to `lock_document` and `unlock_document`.
    *   Implement logic to prevent editing/deletion of locked documents by others.
*   **Frontend (React):**
    *   Display lock status and who locked a document.
    *   "Lock" / "Unlock" buttons for users with appropriate permissions.
    *   Disable edit functions if a document is locked by another user.

### 2.4 Granular Access Control (System Admin, Senior Department Head, Department Head)

*   **Backend (Django):**
    *   Implement object-level permissions (e.g., using `django-guardian` or custom permissions logic).
    *   Define permissions like `view_document`, `edit_document`, `delete_document`, `share_document`, `lock_document` for `Document` and `Folder` models.
    *   API endpoints to manage permissions for specific documents/folders by user/group.
*   **Frontend (React):
    *   Develop an Access Control UI for Admins/Dept Heads to set permissions.
    *   Enforce UI element visibility and action availability based on current user's permissions.

---

## Phase 3: Advanced Features & Refinements

**Goal:** Integrate advanced collaboration, automation, and security features.

### 3.1 OCR Integration (Employee, Department Head for scanned docs)

*   **Backend (Django):**
    *   Integrate Tesseract (via `pytesseract`) to process uploaded image files (PNG, JPG) and PDF images.
    *   Store extracted text in a searchable field (e.g., `extracted_text` on `Document` model).
    *   Update search functionality to include `extracted_text`.
*   **Frontend (React):**
    *   Indicate if a document has been OCR'd.
    *   Option to manually trigger OCR (for Admin).

### 3.2 Embedded Editor (Users editing documents)

*   **Backend (Django):**
    *   API endpoint to fetch document content for editing.
    *   API endpoint to save edited content (creating a new version).
    *   Consider handling different file types (plain text, markdown, basic rich text).
*   **Frontend (React):**
    *   Integrate a lightweight web-based editor component (e.g., CodeMirror for text/code, Quill/TinyMCE for rich text).
    *   Enable in-browser editing for supported document types.

### 3.3 Sharing & Rating (All Users)

*   **Backend (Django):**
    *   Define `SharedDocument` model (linking `Document` to `CustomUser` with `permission_level`).
    *   API endpoints to share documents/folders with users/groups.
    *   Define `DocumentRating` model (linking `Document` to `CustomUser` with `rating` value).
    *   API endpoints for rating documents.
*   **Frontend (React):**
    *   "Share" dialog with user/group selection and permission options.
    *   Star-rating component for documents.
    *   "Shared With Me" view.

### 3.4 Annotations & Comments (All Users)

*   **Backend (Django):**
    *   Define `Annotation` or `Comment` model: fields for `document` (ForeignKey), `user` (ForeignKey), `content`, `timestamp`, `target_area` (e.g., text selection, page number).
    *   API endpoints to add, view, delete annotations/comments.
*   **Frontend (React):**
    *   Integrate an annotation tool into the embedded viewer.
    *   Display comments alongside documents.

### 3.5 Inform Mechanism / Notifications (All Users)

*   **Backend (Django):**
    *   Implement a `Notification` model: fields for `user` (ForeignKey), `message`, `link_to_document`, `read_status`, `timestamp`.
    *   Trigger notifications on document upload, modification, sharing, workflow status changes.
    *   API endpoint to fetch user's notifications.
*   **Frontend (React):**
    *   Display a notification icon/badge.
    *   A notification panel/dropdown.
    *   Clickable links in notifications to navigate to the relevant document.

### 3.6 Workflow Automation (System Admin, Senior Department Head)

*   **Backend (Django):**
    *   Define `Workflow` and `WorkflowStep` models.
    *   Ability to define simple linear workflows (e.g., "Draft -> Review -> Approve").
    *   Integrate workflow triggers with document events (e.g., "Document uploaded to X folder starts Workflow Y").
    *   API endpoints for workflow definition and status updates.
*   **Frontend (React):**
    *   UI for System Admin/Senior Department Head to define simple workflows.
    *   Display current workflow status for documents.
    *   "Approve" / "Reject" actions within the document viewer/details.

---

## Phase 4: Refinements, Testing & Deployment

**Goal:** Polish the system, ensure stability, security, and prepare for production.

### 4.1 Security Hardening

*   Implement MFA (e.g., `django-allauth` for extensibility).
*   Detailed logging of security-sensitive actions (e.g., access attempts, permission changes).
*   Input validation and sanitization on all forms/APIs.
*   Rate limiting for API endpoints.

### 4.2 Error Handling & Logging

*   Implement comprehensive error logging on the backend.
*   Graceful error messages on the frontend.

### 4.3 Performance Optimization

*   Review and optimize database queries.
*   Implement caching strategies (e.g., Redis).
*   Optimize frontend asset loading.

### 4.4 User Acceptance Testing (UAT)

*   Conduct testing with representatives from each user role.
*   Gather feedback and iterate on UI/UX.

### 4.5 Documentation

*   Developer documentation (API, database schema).
*   User manuals for each role.

### 4.6 Deployment

*   Prepare production environment (web server, reverse proxy, process manager).
*   Configure environment variables.
*   Set up continuous integration/continuous deployment (CI/CD) pipeline (optional but recommended).

---

## Task Breakdown by User Role

### System Administrator Tasks:
*   Project setup and configuration (DB, Django, React initial setup).
*   User management (create/edit users, assign roles).
*   Define global security policies (password strength, MFA).
*   Manage document types and correspondents.
*   Set up initial folder structures and default permissions.
*   Monitor system logs and performance.
*   Define and manage workflow templates.
*   Manage storage settings.

### Senior Department Head Tasks:
*   Manage users within their department (under System Admin oversight).
*   Set department-level folder structures and default permissions.
*   Participate in defining higher-level workflows.
*   Review and approve critical documents as part of workflows.
*   Access and report on departmental document usage.

### Department Head Tasks:
*   Manage employees within their sub-department.
*   Create and manage folders within their assigned domain.
*   Upload, organize, and manage departmental documents.
*   Initiate and participate in document review/approval workflows.
*   Share documents with team members or other departments.
*   Set specific document/folder permissions within their purview.
*   Review document ratings.

### Employee Tasks:
*   Upload new documents.
*   View, search, and retrieve documents based on permissions.
*   Edit documents (when assigned and not locked by others).
*   Participate in document review processes (e.g., providing feedback, approving).
*   Add annotations and comments to documents.
*   Rate documents.
*   Receive notifications about document changes.