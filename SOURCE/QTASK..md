# DOCUMENT SOLUTIONS - Development Tasks

## Important: Global Development Rules

Before starting any task, please read and follow the guidelines in [RULES.md](./RULES.md) which contains important coding standards, testing requirements, and project conventions.

## Phase 1: Foundation & Core Setup (Weeks 1-2)

### Task 1: Project Initialization
*   [x] Create a new Django project named `document_solutions`.
*   [x] Initialize a Git repository.
*   [x] Set up a virtual environment (`venv`) and install required packages: `django`, `djangorestframework`, `psycopg2-binary`, `python-dotenv`, `Pillow` (for image processing), `pytesseract`, `scikit-learn` (for ML).
*   [x] Configure `.env` file for environment variables (DATABASE_URL, SECRET_KEY, etc.).

### Task 2: Database Schema Design & Migration
*   [x] Design the core database models:
    *   `User` (extends Django's `AbstractUser` or `User` model)
    *   `Role` (e.g., 'admin', 'senior_dept_head', 'dept_head', 'employee')
    *   `Permission` (e.g., 'view', 'edit', 'delete') - linked to Roles.
    *   `Folder` (with name, parent folder, owner, permissions)
    *   `Document` (with file field, title, description, type, status, owner, upload_date, last_modified_date)
    *   `Metadata` (e.g., tags, correspondents, document_type - could be fields on `Document` or separate table)
    *   `Version` (linked to `Document`, with version_number, file_path, upload_date, creator)
    *   `Lock` (file_id, user_id, timestamp)
    *   `Share` (document_id, shared_with_user_id, permission_level)
    *   `Rating` (document_id, user_id, rating_value)
    *   `Notification` (user_id, message, timestamp, read_status)
    *   `AuditLog` (action, entity_id, user_id, timestamp) - Optional but highly recommended.
*   [x] Create Django migrations for all models.
*   [x] Run migrations against the PostgreSQL database.
*   [x] Verify the schema using `pgAdmin 4`.

### Task 3: User & Authentication Setup
*   [x] Implement user registration and login functionality using Django's built-in authentication.
*   [x] Create a custom `User` model if needed (e.g., to add `role` field).
*   [x] Implement role assignment upon user creation (e.g., admin creates users, assigns roles).
*   [x] Set up the Django admin site for managing users and roles.

### Task 4: Backend API (Django REST Framework)
*   [x] Create API endpoints for:
    *   User registration/login/logout.
    *   CRUD operations for `Folder` and `Document`.
    *   CRUD operations for `Version` (get list, get specific version, revert).
    *   CRUD operations for `Lock` (acquire, release).
    *   CRUD operations for `Share` (create, update, delete).
    *   CRUD operations for `Rating`.
    *   Creating `Notification` objects.
*   [x] Implement authentication (TokenAuthentication or SessionAuthentication).
*   [x] Implement basic permission classes (e.g., `IsAuthenticated`, `IsOwnerOrReadOnly`).
*   [x] Test API endpoints using Postman or curl.

## Phase 2: Core Functionality Implementation (Weeks 3-6)

### Task 5: File Upload & Storage
*   [x] Implement a file upload endpoint that accepts multipart/form-data.
*   [x] Save the uploaded file to a designated directory (e.g., `media/documents/`).
*   [x] Generate a unique filename to avoid conflicts.
*   [x] Create a `Document` object in the database with the file path and metadata.
*   [x] Implement file download endpoint.

### Task 6: Document Search
*   [x] Implement a search endpoint that takes a query string.
*   [ ] Query the database for documents matching the query in title, description, tags, and other relevant metadata.
*   [ ] Implement full-text search using PostgreSQL's `tsvector` and `tsquery` capabilities for better performance and relevance.
*   [ ] Return results with metadata (title, author, date, tags, preview URL).
*   [ ] Add pagination to the search results.

### Task 7: Versioning
*   [ ] Modify the `Document` model to track versions.
*   [ ] Implement logic to create a new `Version` record whenever a document is edited (via the API).
*   [ ] Implement a view to retrieve all versions of a document.
*   [ ] Implement a view to allow reverting to a previous version (copy the file, update the main `Document` record).
*   [ ] Display version history on the document detail page.

### Task 8: File Locking
*   [ ] Implement a mechanism to lock a document when a user attempts to edit it.
*   [ ] Check for an existing lock before allowing an edit.
*   [ ] Create a `Lock` record when a user acquires a lock.
*   [ ] Release the lock when the user saves or closes the document.
*   [ ] Display the lock status on the document UI.

### Task 9: Sharing & Rating
*   [ ] Implement a sharing interface (UI and API) to select users/groups and set permissions.
*   [ ] Implement a rating system (e.g., 1-5 stars) accessible to authorized users.
*   [ ] Calculate average ratings for display.
*   [ ] Ensure sharing permissions are enforced in all document access views.

### Task 10: Embedded Viewer/Editor
*   [ ] Research and implement a solution for viewing common document types (PDF, Word, Excel, Images) directly in the browser.
    *   For PDFs: Use `react-pdf` library.
    *   For Office Docs: Consider using online viewers (e.g., Google Docs viewer, Microsoft Office Online API) or convert to HTML/PDF on the fly (complex).
*   [ ] Implement a basic editor (e.g., using `react-quill` for text, or integrate a simple WYSIWYG editor for plain text).
*   [ ] Link editing functionality to the API to save changes back to the server.

### Task 11: Notification System
*   [ ] Implement a notification system triggered by events (document created, modified, shared).
*   [ ] Create a `Notification` model.
*   [ ] Develop a background task (using Celery or Django's `async_to_sync`) to send notifications.
*   [ ] Implement a dashboard or sidebar in the frontend to display unread notifications.

## Phase 3: Enhancement & Polish (Weeks 7-8)

### Task 12: Drag and Drop
*   [x] Implement drag-and-drop functionality in the React frontend for uploading files and moving documents between folders.
*   [x] Update the backend API to handle these actions.

### Task 13: OCR Processing
*   [ ] Integrate `pytesseract` into the backend.
*   [ ] Create a process to run OCR on uploaded documents (especially scanned PDFs/images).
*   [ ] Extract searchable text and store it in the database (e.g., in a `text_content` field or as a separate `ocr_text` table).
*   [ ] Update the search functionality to include OCR text.

### Task 14: Machine Learning for Auto-Tagging
*   [ ] Train a simple ML model (e.g., Naive Bayes, SVM) using sample documents and their tags.
*   [ ] Implement a function to predict tags for new documents based on their content.
*   [ ] Offer this as an optional feature during upload.

### Task 15: Reporting & Analytics
*   [ ] Implement a report generation feature to show:
    *   Most accessed documents.
    *   Documents with low ratings.
    *   Documents nearing review deadlines.
*   [ ] Create a dashboard for administrators to view key metrics.

### Task 19: UI Implementation
*   [x] Set up React frontend structure based on DesignRef.txt
*   [x] Create component library from the design elements
*   [x] Implement basic routing for dashboard, documents, inbox, and settings
*   [x] Integrate with Django API endpoints
*   [x] Implement document management UI with tables and search
*   [x] Create upload functionality with drag-and-drop support
*   [x] Build tag and correspondent management interfaces
*   [x] Develop user authentication screens
*   [x] Enhance search interface with filters and advanced options
*   [x] Implement notification system UI
*   [x] Add statistics and reporting dashboard
*   [x] Create settings and user management panels
*   [x] Refine UI/UX based on user feedback
*   [x] Implement responsive design for all components
*   [x] Conduct usability testing
*   [x] Optimize performance
*   [x] Implement role-based sidebar navigation based on REF-Sidebar.txt
*   [x] Rescan and update implementation to fully align with REF-Sidebar.txt
*   [x] Rescan and update implementation to align with updated REF-Sidebar.txt design
*   [x] Rescan and update implementation to align with latest REF-Sidebar.txt structure
*   [x] Remove system name "Document Solutions" from the sidebar as per REF-Sidebar.txt update
*   [x] Move Actions section to right sidebar alongside statistics for improved workflow
*   [x] Separate panels in right sidebar and group actions according to their respective functions
*   [x] Implement vertical scrollbar in sidebar for better accessibility
*   [x] Integrate drag and drop functionality into Document Actions panel and remove separate upload panel
*   [x] Enhance header with system name, expanded search bar, and notification bell
*   [x] Add navigation menu below header with role-based menu options

### Task 20: Adobe-Style GUI Implementation
*   [ ] Update global styling to use dark theme with Adobe-like color scheme
*   [ ] Redesign the application bar with menus and quick actions
*   [ ] Implement collapsible left navigation panel
*   [ ] Create right property panels for document management
*   [ ] Add bottom status bar with system information
*   [ ] Update existing components to fit the new layout
*   [ ] Ensure responsive design for different screen sizes
*   [ ] Maintain role-based access control in the new interface
*   [ ] Conduct usability testing with new interface
*   [ ] Optimize performance of new components

## Phase 4: Testing & Deployment (Week 9+)

### Task 16: Testing
*   [ ] Write unit tests for all backend models and views.
*   [ ] Write integration tests for critical workflows (upload, search, versioning, sharing).
*   [ ] Conduct user acceptance testing (UAT) with stakeholders.

### Task 17: Deployment
*   [ ] Prepare the production environment (server, domain, SSL certificate).
*   [ ] Deploy the Django backend (e.g., using Gunicorn + Nginx).
*   [ ] Deploy the React frontend (e.g., as static files served by Nginx or a CDN).
*   [ ] Set up monitoring and logging.

### Task 18: Documentation & Handover
*   [ ] Create user documentation.
*   [ ] Document the API endpoints.
*   [ ] Prepare a final handover presentation.