

### Comprehensive Sidebar Content by User Role for DOCUMENT SOLUTIONS

This section details the recommended content and functionality for each sidebar option, categorized by the user role that has access to it.

---

#### Global Sidebar Components (Accessible by All Roles, adjusted by permissions)

1.  **Home / Dashboard**
    *   **Purpose:** Provide a personalized overview of relevant activities and a quick entry point to frequently accessed items.
    *   **Content:**
        *   **Welcome Message:** Dynamic greeting (e.g., "Welcome, [User Name]!").
        *   **Quick Access/Recently Viewed Documents:** A list (e.g., 5-10 items) of documents the user has recently viewed or edited, with direct links. Display `document.name`, `document.updated_at`, `document.folder.name`.
        *   **My Tasks (from Workflow):** A concise list of pending `dms_workflowtask` assigned to the `current_user_id` with `status='PENDING'`. Display `workflow_instance.document.name`, `workflow_step.name`, `workflow_task.due_date`, and a direct link to the document in question to action the task.
        *   **Notifications Summary:** A count of unread `dms_notification`s for the `current_user_id`. Maybe display a snippet of the latest 1-2 unread notifications with a link to the full notifications list.
        *   **Storage Usage (if applicable to user's permissions):** A small widget showing personal/departmental storage consumed vs. allocated.
        *   **Important Alerts/Announcements:** System-wide messages from the System Administrator.
    *   **Interactive Elements:** Clickable links for documents, tasks, and notifications.

2.  **Documents**
    *   **Purpose:** The primary interface for navigating, viewing, searching, and managing documents within authorized folders.
    *   **Content:**
        *   **Folder Tree View:** A hierarchical, collapsible/expandable tree structure displaying `dms_folder`s that the `current_user_id` has `view` permission for. Root folders are top-level. Sub-folders are indented.
        *   **Selected Folder Content Area:** When a folder is selected from the tree, the main content area displays:
            *   **Sub-folders:** A list or grid of direct sub-folders within the selected `dms_folder`, with `folder.name`, `folder.owner.username`, `folder.updated_at`.
            *   **Documents List:** A list or grid of `dms_document`s within the selected `dms_folder`, with `document.name`, `document.uploader.username`, `document.document_type.name`, `document.updated_at`, `document.current_version.version_number`, `document.locked_by.username` (if locked).
        *   **Search Bar:** Global search functionality that applies to the current folder or across all accessible documents.
        *   **Filtering Options:** By `document_type`, `correspondent`, `tag`, `uploader`, `date_range`.
        *   **Sorting Options:** By `name`, `upload_date`, `updated_at`, `file_size`.
        *   **Action Buttons (Contextual based on `guardian` permissions):**
            *   **Create Folder:** (If `current_user_id` has `add_folder` permission in parent folder) Opens a modal to input `folder.name`, optionally `folder.owner`.
            *   **Upload Document:** (If `current_user_id` has `add_document` permission in selected folder) Opens a modal/panel for document upload (file input, drag-and-drop), `document.name`, `document.description`, `document_type.id`, `correspondent.id`, `tags` (multi-select).
            *   **Document Context Menu (on individual documents):**
                *   **View:** Opens `dms_document` in embedded viewer.
                *   **Edit:** (If `edit_document` permission and not locked) Opens `dms_document` in embedded editor, triggers file lock.
                *   **Download:** Downloads `dms_document.current_version.file`.
                *   **Share:** (If `share_document` permission) Opens `dms_shareditem` modal to specify `shared_with_user_id`/`shared_with_group_id`, `permission_level`, `expires_at`.
                *   **Lock/Unlock:** (If `lock_document` permission) Toggles `document.locked_by_id`.
                *   **Version History:** Opens a panel displaying `dms_documentversion`s for the document, with `version_number`, `uploaded_by.username`, `created_at`, `comment`. Options to `view`, `download`, `revert` (if `edit_document` permission).
                *   **Delete:** (If `delete_document` permission) Soft delete (`document.is_active = FALSE`).
                *   **Move/Copy:** (If appropriate permissions) Modal to select new `dms_folder`.
                *   **Add Tag:** (If `edit_document` permission) Modal to add/remove `dms_tag`s.
                *   **Add Annotation/Comment:** (If `add_annotation` permission) Opens annotation panel.
                *   **Start Workflow:** (If `initiate_workflow` permission) Modal to select `dms_workflowtemplate`.
        *   **Right Property Panel (on document selection):** Displays all metadata (`document.name`, `document.description`, `document_type.name`, `correspondent.name`, `uploader.username`, `created_at`, `updated_at`, `tags`), `document.rating` (average), and `dms_annotation`s/comments related to the `document.current_version`. Options to edit metadata.

3.  **Notifications**
    *   **Purpose:** Centralized view of all system and workflow notifications.
    *   **Content:**
        *   **List of Notifications:** Display `dms_notification`s for the `current_user_id` in chronological order.
        *   **Each Notification:** `notification.message`, `notification.created_at`, `notification.is_read` status (visual indicator).
        *   **Action Buttons:**
            *   **Mark as Read/Unread:** Toggles `notification.is_read`.
            *   **Clear All Read:** Deletes `is_read=TRUE` notifications.
            *   **View Item:** Navigates to `notification.link_to_item`.

4.  **Shared With Me**
    *   **Purpose:** Allows users to quickly find documents or folders that have been explicitly shared with them.
    *   **Content:**
        *   **List of Shared Items:** Display `dms_shareditem`s where `shared_with_user_id = current_user_id` or `shared_with_group_id` includes `current_user_id`'s group.
        *   **Each Item:** `document.name` or `folder.name`, `shared_by.username`, `permission_level`, `created_at`, `expires_at` (if applicable).
        *   **Action Buttons (Contextual based on `permission_level`):** View, Edit, Download.

---

#### System Administrator Specific Sidebar Options

1.  **Home / Dashboard** (As Global, but with additional admin insights)
    *   **Additional Content:**
        *   **System Health/Usage:** Storage occupied, number of active users, pending workflows.
        *   **Security Alerts:** Failed login attempts, suspicious activity summary.
        *   **Critical Workflow Tasks:** Overview of stalled or high-priority workflows.

2.  **Documents** (As Global, but with full system access)
    *   **Additional Functionality:**
        *   **Bypass Permissions:** Ability to view/edit/delete any document/folder for auditing/troubleshooting.
        *   **Global Search:** Search across all documents regardless of folder or department.

3.  **User Management**
    *   **Purpose:** Comprehensive tools for managing all users and their roles within the system.
    *   **Content:**
        *   **User List Table:** Display all `users_customuser`s with `username`, `first_name`, `last_name`, `email`, `role`, `department`, `is_active`, `mfa_enabled`, `last_login`.
        *   **Filtering & Sorting:** By any user field.
        *   **Action Buttons:**
            *   **Create New User:** (Modal) Input `username`, `password`, `first_name`, `last_name`, `email`, select `role` (Admin, Senior Department Head, Department Head, Employee), select `department`, `mfa_enabled`.
            *   **Edit User (on individual user selection):** (Modal) Modify any user field.
            *   **Deactivate/Activate User:** Toggles `is_active` status.
            *   **Reset Password:** Forces password change.
            *   **Manage MFA:** Enable/disable MFA for a user.
            *   **Assign/Remove from Group:** (If using Django's `Group` for granular permissions).

4.  **Department Management**
    *   **Purpose:** Manage the organizational structure (departments).
    *   **Content:**
        *   **Department Tree/List View:** Display the `dms_folder`s designated as top-level departments, and their sub-departments. (If a dedicated `Department` table is created, this would list those entities).
        *   **Department Details:** When a department is selected, display its name, owner, and associated users.
        *   **Action Buttons:**
            *   **Create New Department (Top-Level):** (Modal) Input `name`, `description`, assign `owner_id` (from any user).
            *   **Create Sub-Department:** (Modal, contextual to selected department) Input `name`, `description`, assign `owner_id`.
            *   **Edit Department:** Modify `name`, `description`, `owner`.
            *   **Delete Department:** Soft delete (marks `is_active=FALSE`, cascades to users/folders if applicable).

5.  **System Settings**
    *   **Purpose:** Configure global parameters for the DMS.
    *   **Content:**
        *   **Security Settings:**
            *   Password Policy Configuration (min length, complexity, history).
            *   MFA enforcement (global on/off, mandatory roles).
            *   Session timeouts.
        *   **Storage Settings:**
            *   Current storage usage statistics.
            *   Configuration for `MEDIA_ROOT` (path).
            *   Retention policies (e.g., auto-delete old versions after X days).
        *   **Document Types:**
            *   List of `dms_documenttype`s (`name`, `description`).
            *   Action buttons: Create, Edit, Delete document types.
        *   **Correspondents:**
            *   List of `dms_correspondent`s (`name`, `description`).
            *   Action buttons: Create, Edit, Delete correspondents.
        *   **Tags Management:**
            *   List of `dms_tag`s (`name`).
            *   Action buttons: Create, Edit, Delete tags.
        *   **OCR Settings:**
            *   Enable/Disable OCR.
            *   Language configuration for Tesseract.
            *   OCR processing limits.
        *   **Notification Settings:**
            *   Email server configuration.
            *   Default notification templates.

6.  **Workflow Templates**
    *   **Purpose:** Define and manage reusable workflow templates.
    *   **Content:**
        *   **List of Workflow Templates:** Display `dms_workflowtemplate`s with `name`, `description`, `created_by.username`, `is_active`.
        *   **Action Buttons:**
            *   **Create New Template:** (Multi-step form/wizard) Input `workflow_template.name`, `description`. Then define `dms_workflowstep`s: `step_order`, `name`, `description`, `assigned_role`/`assigned_user_id`, `required_action`, `duration_days`.
            *   **Edit Template:** Modify template details or steps.
            *   **Activate/Deactivate Template.**
            *   **Delete Template.**
            *   **View Active Instances:** Link to `Workflow Instances` filtered by this template.

7.  **Audit Logs**
    *   **Purpose:** Review all system and user activities for security, compliance, and troubleshooting.
    *   **Content:**
        *   **Filterable Log Table:** Display `dms_auditlog` entries with `timestamp`, `user.username` (or System if no user), `action`, `object_type`, `object_id` (linked to item), `details` (JSON viewer), `ip_address`, `is_sensitive`.
        *   **Filtering Options:** By `user_id`, `action`, `object_type`, `date_range`, `is_sensitive`.
        *   **Sorting Options:** By `timestamp`.

---

#### Senior Department Head Specific Sidebar Options

1.  **Home / Dashboard** (As Global, with departmental focus)
    *   **Additional Content:**
        *   **Departmental Performance Metrics:** Number of documents uploaded in department, completion rates of departmental workflows.
        *   **Key Departmental Alerts:** Overdue tasks, documents nearing expiration.

2.  **Documents** (As Global, but with broad departmental access)
    *   **Additional Functionality:**
        *   Access to all documents and folders within their assigned top-level department and its sub-departments, regardless of individual folder ownership.
        *   Ability to oversee/manage folders owned by Department Heads under them.

3.  **Departmental User Management**
    *   **Purpose:** Manage users within the Senior Department Head's assigned departmental hierarchy.
    *   **Content:**
        *   **User List Table (Filtered):** Display `users_customuser`s whose `department` falls under the Senior Department Head's scope, with `username`, `role`, `department`, `is_active`.
        *   **Action Buttons:**
            *   **Create New User:** (Modal) Input fields for `Department Head` or `Employee` roles, assigned *only to departments within their scope*.
            *   **Edit User:** Modify details for users within their scope.
            *   **Deactivate/Activate User:** For users within their scope.

4.  **Departmental Structure**
    *   **Purpose:** Manage sub-departments within their main department.
    *   **Content:**
        *   **Sub-Department Tree/List View:** Display `dms_folder`s structured as sub-departments directly under their main department.
        *   **Action Buttons:**
            *   **Create New Sub-Department:** (Modal) Input `name`, `description`, assign `owner_id` (a user from within their departmental scope, typically a Department Head).
            *   **Edit Sub-Department:** Modify `name`, `description`, `owner`.
            *   **Delete Sub-Department:** Soft delete.

5.  **Workflow Instances**
    *   **Purpose:** Monitor and manage active workflows within their departmental scope.
    *   **Content:**
        *   **List of Workflow Instances:** Display `dms_workflowinstance`s for documents within their assigned department, with `workflow_template.name`, `document.name`, `status`, `initiated_by.username`, `current_step.name`, `started_at`.
        *   **Filtering & Sorting:** By `status`, `template`, `document_type`, `date`.
        *   **Action Buttons (on individual workflow):**
            *   **View Progress:** Detailed view of `dms_workflowtask`s, `assigned_to.username`, `status`, `comment`, `completed_at`.
            *   **Intervene/Force Complete/Cancel:** (If explicit permission granted by System Admin) Override workflow steps or status.
            *   **Assign Task:** Reassign a pending `dms_workflowtask`.

---

#### Department Head Specific Sidebar Options

1.  **Home / Dashboard** (As Global, with team/sub-department focus)
    *   **Additional Content:**
        *   **Team Performance:** Overview of documents created, workflow tasks completed by their direct team.
        *   **Pending Team Approvals:** Quick links to documents awaiting their approval.

2.  **Documents** (As Global, with team-specific access)
    *   **Additional Functionality:**
        *   Access to all documents and folders within their assigned sub-department.
        *   Creation/Management of folders and documents primarily within their owned or managed sub-department.

3.  **Team User Management**
    *   **Purpose:** Manage employees directly under their supervision.
    *   **Content:**
        *   **User List Table (Filtered):** Display `users_customuser`s whose `department` matches the Department Head's specific sub-department and `role='EMPLOYEE'`.
        *   **Action Buttons:**
            *   **Create New Employee:** (Modal) Input fields for an `Employee` role, assigned *only to their specific department*.
            *   **Edit Employee:** Modify details for employees under their supervision.
            *   **Deactivate/Activate Employee.**

4.  **My Workflows**
    *   **Purpose:** View and manage workflows that they have initiated or are actively involved in.
    *   **Content:**
        *   **List of Workflow Instances (Filtered):** Display `dms_workflowinstance`s where `initiated_by_id = current_user_id` OR `dms_workflowtask` for `current_user_id` exists.
        *   **Action Buttons:** Similar to Senior Department Head's `Workflow Instances` but limited to workflows they own or are part of. Focus on completing `dms_workflowtask`s.

---

#### Employee Specific Sidebar Options

1.  **Home / Dashboard** (As Global, with personal focus)
    *   **Additional Content:**
        *   **My Uploads:** Count and list of recent documents uploaded by the employee.
        *   **My Overdue Tasks:** Highlight overdue `dms_workflowtask`s.

2.  **Documents** (As Global, with restricted access)
    *   **Functionality:**
        *   Access strictly limited by `guardian` permissions, typically to documents and folders they own, are shared with, or are part of a workflow.
        *   `Upload Document` button only visible if `add_document` permission exists in the current folder.
        *   Document context menu actions are strictly permission-based (e.g., if `edit_document` is not granted, "Edit" button is hidden).

3.  **My Workflows**
    *   **Purpose:** View and action workflow tasks assigned to them.
    *   **Content:**
        *   **List of My Tasks:** Display `dms_workflowtask`s where `assigned_to_id = current_user_id`.
        *   **Each Task:** `document.name`, `workflow_step.name`, `status`, `assigned_at`, `due_date`.
        *   **Action Buttons (on individual task):**
            *   **View Document:** Opens the associated `dms_document`.
            *   **Complete Task:** (Modal) Record `action_taken` (e.g., "APPROVED", "REJECTED", "COMPLETED"), `comment`.
            *   **Request Clarification:** Sends a notification to the workflow initiator.

---

This detailed breakdown ensures that each user role has the necessary tools and information accessible from the sidebar, while maintaining the hierarchy and security principles established. The focus on direct, elaborate instructions for components should facilitate clear implementation by the development team.