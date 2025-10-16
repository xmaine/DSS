Understood. Now, let's explicitly define the Employee role's scope of control, administrative capabilities, and oversight responsibilities based on the project plan and detailed UI blueprint. This will provide a comprehensive understanding of their place within DOCUMENT SOLUTIONS.

---

### Employee Role: Scope of Control, Administrative Capabilities, and Oversight Responsibilities

The "Employee" role in DOCUMENT SOLUTIONS is designed to be a primary consumer and contributor of documents, with a focus on day-to-day document-centric tasks. Their capabilities are primarily operational and collaborative, limited to their assigned permissions, ensuring data integrity and security within the system.

#### 1. Scope of Control

The Employee's scope of control is precisely defined by object-level permissions managed through `django-guardian` (as proposed) and explicit sharing mechanisms (`dms_shareditem`).

*   **Document Access:**
    *   **View:** Can view documents and folders they own, documents explicitly shared with them, or documents located in folders where they have explicit "view" permission (e.g., their department's common folders).
    *   **Edit:** Can edit documents that they own, documents where they have been granted explicit "edit" permission via sharing, or documents within a workflow task specifically assigned to them with "edit" action (`dms_workflowtask`).
    *   **Upload:** Can upload new documents into folders where they have "add_document" permission.
    *   **Download:** Can download any document they have "view" permission for.
    *   **Lock/Unlock:** Can lock documents they are actively editing or plan to edit, provided they have "lock_document" permission for that specific document. They can only unlock documents they have locked themselves.
    *   **Versioning:** Can create new versions of documents they are allowed to edit. Can view the version history of documents they can view. Cannot revert to older versions unless explicitly permitted to edit the document and the "revert" action is enabled.
    *   **Delete (Soft):** Can soft-delete documents or folders they own, provided they have "delete" permission for that object. This marks `is_active=FALSE` in `dms_document` or `dms_folder`.
    *   **Move/Copy:** Can move or copy documents/folders if they have the necessary "edit" or "delete" permission in the source location and "add" permission in the destination.
    *   **Tagging:** Can add or remove `dms_tag`s from documents they have "edit" permission for.
    *   **Annotations/Comments:** Can add `dms_annotation`s to specific document versions they have "add_annotation" permission for.

*   **Folder Access:**
    *   **View:** Can view folders they own, folders explicitly shared with them, or folders belonging to their department where they have "view" permission.
    *   **Create:** Can create new sub-folders within existing folders where they have "add_folder" permission.
    *   **Edit Folder Metadata:** Limited ability to rename folders they own, if "edit_folder" permission is granted.
    *   **Sharing:** Can share documents or folders they own with other users or groups, provided they have "share" permission for that object.

*   **Workflow Participation:**
    *   **Initiate:** Can initiate workflows on documents they own or have explicit "initiate_workflow" permission for.
    *   **Participate:** Is assigned `dms_workflowtask`s and must complete `required_action`s (e.g., Approve, Reject, Edit, View & Comment) with associated `comment`s.
    *   **Monitor:** Can view the status and progress of workflows they have initiated or are actively involved in (`My Workflows`).

*   **Collaboration:**
    *   **Sharing:** Can be a recipient of shared documents or folders (`dms_shareditem`).
    *   **Notifications:** Receives `dms_notification`s related to workflow tasks, document updates, or system announcements.

#### 2. Administrative Capabilities

The Employee role has **minimal to no direct administrative capabilities** over the system itself or other users. Their administrative scope is limited to managing their *own* content and user profile.

*   **Personal Profile Management:**
    *   Can view and update their own `first_name`, `last_name`, and `email` (`users_customuser` fields).
    *   Can change their own password.
    *   Can enable/disable Multi-Factor Authentication (MFA) for their own account.
    *   Cannot change their `role` or `department`.

*   **Document/Folder Ownership:**
    *   Employees are considered "owners" of the documents and folders they create or upload by default (`owner_id` on `dms_folder`, `uploader_id` on `dms_document`). This ownership grants them inherent permissions (e.g., edit, delete, share) on those specific items, which can then be delegated or further restricted by higher-level administrators.

*   **No User/Role Management:**
    *   Cannot create, edit, deactivate, or delete other user accounts.
    *   Cannot assign or modify user roles or departmental affiliations for others.

*   **No System Configuration:**
    *   Cannot access or modify any system-wide settings such as security policies, storage settings, document types, correspondent lists, OCR configurations, or workflow templates.

*   **No Global Data Management:**
    *   Cannot create or manage `dms_documenttype`s, `dms_correspondent`s, or global `dms_tag`s. They can only apply existing tags.

#### 3. Oversight Responsibilities

An Employee's oversight responsibilities are primarily individual and operational, focusing on adherence to company policy and contribution to data quality.

*   **Data Integrity & Quality:**
    *   **Accurate Uploads:** Responsible for uploading correct and complete versions of documents.
    *   **Meaningful Metadata:** Responsible for providing accurate `document.name`, `document.description`, selecting appropriate `document_type.id`, `correspondent.id`, and applying relevant `dms_tag`s during upload or editing. This directly contributes to efficient search and retrieval.
    *   **Version Control:** Responsible for providing meaningful `comment`s when creating new `dms_documentversion`s to track changes effectively.
    *   **Annotation Quality:** Responsible for providing clear and constructive `dms_annotation`s.

*   **Security & Compliance:**
    *   **Access Control:** Responsible for understanding and respecting the access rights of others, only accessing documents for which they have explicit permission.
    *   **Password Hygiene:** Responsible for maintaining the security of their own account by using strong passwords and enabling MFA.
    *   **Information Sharing:** Responsible for exercising caution when sharing documents, ensuring they only share with authorized individuals or groups and apply appropriate `permission_level`s and `expires_at` dates.
    *   **Adherence to Workflows:** Responsible for diligently completing assigned `dms_workflowtask`s within specified `due_date`s to ensure timely document processing and approvals.

*   **Reporting Anomalies:**
    *   Expected to report any unusual system behavior, security breaches, or data inconsistencies to their Department Head or System Administrator.

In essence, the Employee role is the backbone of document activity within DOCUMENT SOLUTIONS. While they have extensive control over *their own* documents and workflows, their interaction with the system's administrative functions is highly constrained, emphasizing operational efficiency and secure, compliant content contribution.