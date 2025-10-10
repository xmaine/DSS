### Precise Database Structure for DOCUMENT SOLUTIONS (PostgreSQL)

**Schema Design Principles:**
*   **Normalization:** Minimize data redundancy.
*   **Relationships:** Clearly define `ForeignKey` and `ManyToManyField` relationships.
*   **Indexing:** Crucial for search and retrieval performance.
*   **Data Types:** Appropriate types for efficiency and data integrity.
*   **Versioning:** Designed to track document changes effectively.
*   **Permissions:** Granular, object-level permissions.

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
*   **`department`**: `VARCHAR(100)` (NULLABLE) - *Could be FK to a `departments` table for larger orgs*
*   **`mfa_enabled`**: `BOOLEAN` (Default: `FALSE`) - For 2FA status

---

#### 2. `dms_folder` Table

Represents the hierarchical structure of the document repository.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`name`**: `VARCHAR(255)`
*   **`parent_folder_id`**: `BIGINT` (ForeignKey to `dms_folder.id`, NULLABLE for root folders)
*   **`owner_id`**: `BIGINT` (ForeignKey to `users_customuser.id`) - The user primarily responsible for this folder.
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

#### 11. `dms_shareditem` Table

Manages sharing of documents or folders between users/groups.

*   **`id`**: `BIGSERIAL` (Primary Key)
*   **`document_id`**: `BIGINT` (ForeignKey to `dms_document.id`, NULLABLE)
*   **`folder_id`**: `BIGINT` (ForeignKey to `dms_folder.id`, NULLABLE)
*   **`shared_by_id`**: `BIGINT` (ForeignKey to `users_customuser.id`)
*   **`shared_with_user_id`**: `BIGINT` (ForeignKey to `users_customuser.id`, NULLABLE)
*   **`shared_with_group_id`**: `BIGINT` (ForeignKey to `auth_group.id`, NULLABLE) - Assuming Django's built-in `Group` model.
*   **`permission_level`**: `VARCHAR(20)` - Choices: `('VIEW', 'EDIT', 'VIEW_EDIT')`
*   **`created_at`**: `TIMESTAMP WITH TIME ZONE` (Default: `NOW()`)
*   **`expires_at`**: `TIMESTAMP WITH TIME ZONE` (NULLABLE)
*   **`CONSTRAINT chk_one_item`**: Ensures either `document_id` OR `folder_id` is set, not both.
*   **`CONSTRAINT chk_one_recipient`**: Ensures either `shared_with_user_id` OR `shared_with_group_id` is set, not both.

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
*   **`action`**: `VARCHAR(255)` (e.g., "DOCUMENT_UPLOADED", "USER_LOGIN_SUCCESS", "PERMISSION_CHANGED")
*   **`object_type`**: `VARCHAR(100)` (e.g., "Document", "Folder", "User")
*   **`object_id`**: `BIGINT` (NULLABLE) - ID of the object affected.
*   **`details`**: `JSONB` (NULLABLE) - JSON field for additional context (e.g., "old_value": "x", "new_value": "y").
*   **`ip_address`**: `INET` (NULLABLE)
*   **`is_sensitive`**: `BOOLEAN` (Default: `FALSE`) - Flag for security-critical events.

---

#### Permissions with `django-guardian` (Proposed)

Instead of complex custom permission tables, `django-guardian` is highly recommended. It manages permissions at the object level, which is what we need for folders and documents. It creates its own tables:
*   `guardian_userobjectpermission`
*   `guardian_groupobjectpermission`
*   `guardian_permission`

These tables would link directly to `dms_document` and `dms_folder` instances, allowing granular control for `view`, `edit`, `delete`, `lock`, `share` permissions for specific users or groups on individual documents or folders.

---

This detailed database structure, with considerations for common DMS functionalities and workflow, should provide a solid foundation for DOCUMENT SOLUTIONS. We've accounted for user management, document lifecycle, collaboration, security, and auditability.