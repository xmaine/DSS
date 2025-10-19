### Precise Database Structure for DOCUMENT SOLUTIONS (PostgreSQL) - **Updated with Sharing Module**

**Schema Design Principles:**
*   **Normalization:** Minimize data redundancy.
*   **Relationships:** Clearly define `ForeignKey` and `ManyToManyField` relationships.
*   **Indexing:** Crucial for search and retrieval performance.
*   **Data Types:** Appropriate types for efficiency and data integrity.
*   **Versioning:** Designed to track document changes effectively.
*   **Permissions:** Granular, object-level permissions, **leveraging `django-guardian` for primary access control and `dms_shareditem` for explicit ad-hoc sharing.**

---

#### 1. `users_customuser` Table (Django's Custom User Model)

This table will store all user information and their roles.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`password`**: `VARCHAR(128)`
*   **`last_login`**: `TIMESTAMP WITH TIME ZONE` (NULLABLE)
*   **`is_superuser`**: `BOOLEAN` (Default: `FALSE`) - Django built-in
*   **`username`**: `VARCHAR(150)` (UNIQUE) - Django built-in
*   **`first_name`**: `VARCHAR(150)` (Default: `''`) - Django built-in
*   **`last_name`**: `VARCHAR(150)` (Default: `''`) - Django built-in
*   **`email`**: `VARCHAR(254)` (UNIQUE) - Django built-in
*   **`is_staff`**: `BOOLEAN` (Default: `FALSE`) - Django built-in
*   **`is_active`**: `BOOLEAN` (Default: `TRUE`) - Django built-in
*   **`date_joined`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`) - Django built-in
*   **`role`**: `VARCHAR(20)` - Choices: `('ADMIN', 'SENIOR_DEPT_HEAD', 'DEPT_HEAD', 'EMPLOYEE')`
*   **`department_id`**: `BIGINT` (ForeignKey to `dms_department.id`, NULLABLE) - *Changed to FK for better organization.*
*   **`mfa_enabled`**: `BOOLEAN` (Default: `FALSE`) - For 2FA status

---

#### **NEW**: `dms_department` Table

To properly manage departments and link users to them, as hinted in `users_customuser` and mentioned in `QPLAN.md`.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`name`**: `VARCHAR(100)` (UNIQUE)
*   **`description`**: `TEXT` (NULLABLE)
*   **`parent_department_id`**: `BIGINT` (ForeignKey to `dms_department.id`, NULLABLE for top-level departments)
*   **`head_id`**: `BIGINT` (ForeignKey to `users_customuser.id`, NULLABLE) - The designated Department Head or Senior Department Head for this department.
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`updated_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`is_active`**: `BOOLEAN` (Default: `TRUE`) - For soft deletion.

---

#### 2. `dms_folder` Table

Represents the hierarchical structure of the document repository.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`name`**: `VARCHAR(255)`
*   **`parent_folder_id`**: `BIGINT` (ForeignKey to `dms_folder.id`, NULLABLE for root folders)
*   **`owner_id`**: `BIGINT` (ForeignKey to `users_customuser.id`) - The user primarily responsible for this folder.
*   **`department_id`**: `BIGINT` (ForeignKey to `dms_department.id`, NULLABLE) - For departmental top-level folders or if folders inherently belong to a department.
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`updated_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`is_active`**: `BOOLEAN` (Default: `TRUE`) - For soft deletion.
*   **`path`**: `TEXT` (INDEXED) - Materialized path or similar for efficient hierarchy queries. *Consider `django-mptt` or `django-treebeard` for implementation.*

---

#### 3. `dms_documenttype` Table

Defines system-wide categories for documents (e.g., "Invoice", "Contract").

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`name`**: `VARCHAR(100)` (UNIQUE)
*   **`description`**: `TEXT` (NULLABLE)

---

#### 4. `dms_correspondent` Table

Defines external/internal entities related to documents.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`name`**: `VARCHAR(255)` (UNIQUE)
*   **`description`**: `TEXT` (NULLABLE)

---

#### 5. `dms_tag` Table

For free-form tagging of documents.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`name`**: `VARCHAR(100)` (UNIQUE, INDEXED) - E.g., "urgent", "Q3 report", "marketing"

---

#### 6. `dms_document` Table

The core table for document metadata and pointers to files.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`uuid`**: `UUID` (UNIQUE, Default: `uuid.uuid4()`) - Stable identifier for external linking.
*   **`name`**: `VARCHAR(255)`
*   **`description`**: `TEXT` (NULLABLE)
*   **`folder_id`**: `BIGINT` (ForeignKey to `dms_folder.id`, NULLABLE for unorganized docs or direct uploads to root)
*   **`document_type_id`**: `BIGINT` (ForeignKey to `dms_documenttype.id`, NULLABLE)
*   **`correspondent_id`**: `BIGINT` (ForeignKey to `dms_correspondent.id`, NULLABLE)
*   **`uploader_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`current_version_id`**: `BIGINT` (ForeignKey to `dms_documentversion.id`, NULLABLE, self-referencing for efficiency)
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`updated_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`locked_by_id`**: `BIGINT` (ForeignKey to `users_customuser.id`, NULLABLE) - User who currently has the document locked.
*   **`locked_at`**: `TIMESTAMP WITH TIME ZONE` (NULLABLE)
*   **`is_active`**: `BOOLEAN` (Default: `TRUE`) - For soft deletion.
*   **`extracted_text`**: `TEXT` (NULLABLE, INDEXED for full-text search) - Stores OCR'd text.

---

#### 7. `dms_document_tags` Join Table

Many-to-Many relationship between `dms_document` and `dms_tag`.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`document_id`**: `BIGINT` (ForeignKey to `dms_document.id`)
*   **`tag_id`**: `BIGINT` (ForeignKey to `dms_tag.id`)
*   **`UNIQUE(document_id, tag_id)`**: To prevent duplicate tags on a document.

---

#### 8. `dms_documentversion` Table

Stores details for each historical version of a document.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`document_id`**: `BIGINT` (ForeignKey to `dms_document.id`)
*   **`version_number`**: `DECIMAL(5,2)` (e.g., 1.0, 1.1, 2.0)
*   **`file`**: `VARCHAR(255)` - Path to the actual file in storage (e.g., `media/documents/uuid/version.pdf`).
*   **`file_size`**: `BIGINT` (in bytes)
*   **`file_type`**: `VARCHAR(50)` (e.g., 'application/pdf', 'image/jpeg')
*   **`uploaded_by_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`checksum`**: `VARCHAR(64)` (NULLABLE) - E.g., SHA256 hash of the file content for integrity check.
*   **`comment`**: `TEXT` (NULLABLE) - User comment about changes in this version.
*   **`is_current`**: `BOOLEAN` (Default: `FALSE`) - Can be used for quick lookup or removed if `dms_document.current_version_id` is sufficient.

---

#### 9. `dms_documentrating` Table

Stores user ratings for documents.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`document_id`**: `BIGINT` (ForeignKey to `dms_document.id`)
*   **`user_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`rating`**: `SMALLINT` (e.g., 1-5 stars)
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`UNIQUE(document_id, user_id)`**: A user can only rate a document once.

---

#### 10. `dms_annotation` Table

For comments or notes directly on a document.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`document_version_id`**: `BIGINT` (ForeignKey to `dms_documentversion.id`) - Link annotations to specific versions.
*   **`user_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`content`**: `TEXT`
*   **`page_number`**: `INT` (NULLABLE) - For documents with pages (e.g., PDF).
*   **`coords`**: `VARCHAR(255)` (NULLABLE) - JSON or string representing coordinates/text selection on the document.
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`updated_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)

---

#### **UPDATED**: `dms_shareditem` Table

This table is now specifically for **explicit, ad-hoc sharing instances** by a user. It records when one user (or a system process acting on a user's behalf) *shares* an item, and to whom.
**Crucially, `dms_shareditem` creates or modifies `guardian` permissions rather than being the sole source of truth for access.**

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`document_id`**: `BIGINT` (ForeignKey to `dms_document.id`, NULLABLE) - The document being shared.
*   **`folder_id`**: `BIGINT` (ForeignKey to `dms_folder.id`, NULLABLE) - The folder being shared.
*   **`shared_by_id`**: `BIGINT` (ForeignKey to `users_customuser.id`) - The user who initiated the sharing.
*   **`shared_with_user_id`**: `BIGINT` (ForeignKey to `users_customuser.id`, NULLABLE) - The specific user with whom the item is shared.
*   **`shared_with_group_id`**: `BIGINT` (ForeignKey to `auth_group.id`, NULLABLE) - The group with which the item is shared.
*   **`permission_codes`**: `ARRAY TEXT` (e.g., `['view', 'change', 'delete_document']`) - The specific `guardian` permission codes granted by this share. This replaces a single `permission_level` to allow fine-grained control.
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`expires_at`**: `TIMESTAMP WITH TIME ZONE` (NULLABLE) - When this specific share becomes inactive.
*   **`is_active`**: `BOOLEAN` (Default: `TRUE`) - For revoking shares without deleting the record.
*   **`CONSTRAINT chk_one_item`**: Ensures either `document_id` OR `folder_id` is set, not both.
*   **`CONSTRAINT chk_one_recipient`**: Ensures either `shared_with_user_id` OR `shared_with_group_id` is set, not both.
*   **Purpose for "Shared by Me"**: A user can query this table for `WHERE shared_by_id = current_user_id` to see what they have shared.
*   **Purpose for "Shared With Me"**: A user can query this table for `WHERE shared_with_user_id = current_user_id OR shared_with_group_id IN (user_groups)` to see what has been explicitly shared with them.

---

#### 12. `dms_notification` Table

Stores system notifications for users.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`user_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`message`**: `TEXT`
*   **`link_to_item`**: `TEXT` (NULLABLE) - A URL path to the relevant document/workflow item.
*   **`is_read`**: `BOOLEAN` (Default: `FALSE`)
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)

---

#### 13. `dms_workflowtemplate` Table

Defines reusable workflow structures.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`name`**: `VARCHAR(255)` (UNIQUE)
*   **`description`**: `TEXT` (NULLABLE)
*   **`created_by_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`is_active`**: `BOOLEAN` (Default: `TRUE`)

---

#### 14. `dms_workflowstep` Table

Defines individual steps within a workflow template.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`workflow_template_id`**: `BIGINT` (ForeignKey to `dms_workflowtemplate.id`)
*   **`step_order`**: `SMALLINT` - Order of execution (e.g., 1, 2, 3).
*   **`name`**: `VARCHAR(255)` (e.g., "Review", "Approve", "Fact Check")
*   **`description`**: `TEXT` (NULLABLE)
*   **`assigned_role`**: `VARCHAR(20)` (NULLABLE) - Role responsible for this step.
*   **`assigned_user_id`**: `BIGINT` (ForeignKey to `users_customuser.id`, NULLABLE) - Specific user for this step.
*   **`required_action`**: `VARCHAR(50)` (e.g., "APPROVE", "EDIT", "VIEW_AND_COMMENT")
*   **`duration_days`**: `INT` (NULLABLE) - Expected duration for the step.

---

#### 15. `dms_workflowinstance` Table

Represents a live running instance of a workflow for a specific document.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`workflow_template_id`**: `BIGINT` (ForeignKey to `dms_workflowtemplate.id`)
*   **`document_id`**: `BIGINT` (ForeignKey to `dms_document.id`)
*   **`initiated_by_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`current_step_id`**: `BIGINT` (ForeignKey to `dms_workflowstep.id`, NULLABLE)
*   **`status`**: `VARCHAR(20)` - Choices: `('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED')`
*   **`started_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`completed_at`**: `TIMESTAMP WITH TIME ZONE` (NULLABLE)

---

#### 16. `dms_workflowtask` Table

Individual task entries for users within a `workflowinstance`.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`workflow_instance_id`**: `BIGINT` (ForeignKey to `dms_workflowinstance.id`)
*   **`workflow_step_id`**: `BIGINT` (ForeignKey to `dms_workflowstep.id`)
*   **`assigned_to_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`status`**: `VARCHAR(20)` - Choices: `('PENDING', 'COMPLETED', 'REJECTED', 'SKIPPED')`
*   **`action_taken`**: `VARCHAR(50)` (NULLABLE) - (e.g., "APPROVED", "REJECTED_WITH_COMMENT", "EDITED")
*   **`comment`**: `TEXT` (NULLABLE) - Comments made by the user on completing the task.
*   **`assigned_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`completed_at`**: `TIMESTAMP WITH TIME ZONE` (NULLABLE)
*   **`due_date`**: `TIMESTAMP WITH TIME ZONE` (NULLABLE)

---

#### 17. `dms_auditlog` Table

For comprehensive system-wide auditing and security.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`timestamp`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`user_id`**: `BIGINT` (ForeignKey to `users_customuser.id`, NULLABLE for system events)
*   **`action`**: `VARCHAR(255)` (e.g., "DOCUMENT_UPLOADED", "USER_LOGIN_SUCCESS", "PERMISSION_CHANGED", "DOCUMENT_SHARED")
*   **`object_type`**: `VARCHAR(100)` (e.g., "Document", "Folder", "User", "Share")
*   **`object_id`**: `BIGINT` (NULLABLE) - ID of the object affected (e.g., `dms_document.id`, `dms_shareditem.id`).
*   **`details`**: `JSONB` (NULLABLE) - JSON field for additional context (e.g., "old_value": "x", "new_value": "y", "shared_with": "user_id").
*   **`ip_address`**: `INET` (NULLABLE)
*   **`is_sensitive`**: `BOOLEAN` (Default: `FALSE`) - Flag for security-critical events.

---

#### Permissions with `django-guardian` (Proposed)

This is the central pillar of our access control. `django-guardian` will manage direct object-level permissions.
**How `dms_shareditem` and `guardian` interact:**

1.  **Implicit Permissions:** Role-based access and departmental hierarchies (e.g., a Department Head implicitly has access to all documents in their department's folders) should be handled by `guardian`'s group permissions or custom backend logic that *grants* `guardian` permissions. For instance, when a user is assigned to a department, a background process (or signals in Django) would grant that user (or their role's group) relevant `guardian` permissions (`view_folder`, `view_document`) on the department's top-level folder and its contents.
2.  **Explicit Sharing:** When a user initiates a share via the UI (which then populates `dms_shareditem`), the backend process associated with creating that `dms_shareditem` record will *also* explicitly grant the specified `guardian` permissions (`permission_codes`) to the `shared_with_user_id` or `shared_with_group_id` for the `document_id` or `folder_id`.
3.  **Revoking Shares:** When `dms_shareditem.is_active` is set to `FALSE` or `expires_at` is passed, the corresponding `guardian` permissions are revoked.
4.  **Ownership:** The `owner_id` (for `dms_folder`) and `uploader_id` (for `dms_document`) inherently get full `guardian` permissions (`view`, `change`, `delete`).

`django-guardian` creates its own tables, which are crucial for the system:
*   `guardian_userobjectpermission`: Links a user, a permission, and a specific object instance (e.g., `user_id` has `view` permission on `document_id=123`).
*   `guardian_groupobjectpermission`: Links a group, a permission, and a specific object instance (e.g., `group_id` has `edit` permission on `folder_id=456`).
*   `guardian_permission`: A registry of all available permissions (`view_document`, `change_document`, `delete_document`, `lock_document`, `share_document`, `view_folder`, `change_folder`, `delete_folder`, `add_document_to_folder`, `add_folder_to_folder`, etc.).

---

### How "Shared by Me" and "Shared With Me" will be implemented:

**1. "Shared by Me" (Accessed via `dms_shareditem`):**
*   **Data Source:** Query the `dms_shareditem` table where `shared_by_id = current_user_id`.
*   **Display:** List the documents/folders the user has shared, with whom, what permissions were granted (`permission_codes`), and the expiry date. This provides the user with an audit trail and management interface for their outgoing shares.
*   **Management:** Allow the user to revoke (set `is_active=FALSE` and remove `guardian` permission), extend, or modify existing shares they initiated.

**2. "Shared With Me" (Accessed via a combination of `guardian` and `dms_shareditem`):**
*   **Primary Data Source:** The most direct way to check *effective* "Shared With Me" is through `guardian`'s permission checks. Any document or folder for which the `current_user_id` has *any* `guardian` permission (`view`, `edit`, etc.) and that permission was granted via a `dms_shareditem` record (or explicitly by an admin based on a `dms_shareditem` trigger) would qualify.
*   **Augmenting `dms_shareditem`:** Querying `dms_shareditem` where `shared_with_user_id = current_user_id` or `shared_with_group_id` includes any group the user belongs to will directly show *explicit* shares.
*   **Display:** List the documents/folders explicitly shared with the user, who shared them, what permissions they have, and when the share expires. This tab focuses on items that were *specifically granted* to them, not necessarily items they have access to due to their role or departmental affiliation (which are handled by `Documents` view through `guardian`'s role-based access).

This updated structure, with the `dms_department` table and the refined role of `dms_shareditem` in conjunction with `django-guardian`, provides a robust and flexible permission and sharing model aligned with the project's goals.