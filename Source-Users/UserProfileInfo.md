### User Profile Information Details for DOCUMENT SOLUTIONS

**Role:**
*   **Purpose:** To define the user's primary functional level and associated permissions within DOCUMENT SOLUTIONS. This is a foundational element for access control and UI presentation.
*   **Details:**
    *   **Data Type:** String/Choice field.
    *   **Possible Values:** `System Administrator`, `Senior Department Head`, `Department Head`, `Employee`.
    *   **Implementation Note:** Directly maps to the `role` field in the `users_customuser` database table. Crucial for determining sidebar options, available actions, and data visibility.

**Assigned Department:**
*   **Purpose:** To logically group users within the organizational structure and facilitate departmental access control, reporting, and workflow routing.
*   **Details:**
    *   **Data Type:** String, or `ForeignKey` to a `dms_department` table (recommended for scalability and consistency).
    *   **Example Values:** "Sales", "Marketing", "Human Resources", "Finance".
    *   **Implementation Note:** Essential for Senior Department Heads to manage users and documents within their domain, and for Department Heads to manage their sub-teams. Also used for filtering views and notifications. If it's a `ForeignKey`, the `dms_department` table would need `id`, `name`, `parent_department_id` for hierarchical departments.

**Unique Identifier / Username:**
*   **Purpose:** The primary identifier for logging into the system and for system-level references (e.g., in audit logs, document ownership). Must be unique for each user.
*   **Details:**
    *   **Data Type:** String (`VARCHAR`).
    *   **Constraints:** Must be unique. Typically alphanumeric, often case-insensitive during login but stored as-is. Min/max length constraints.
    *   **Implementation Note:** This is Django's built-in `username` field. It's often used programmatically for associating actions with a user.

**First Name:**
*   **Purpose:** Personal identification and polite display within the user interface.
*   **Details:**
    *   **Data Type:** String (`VARCHAR`).
    *   **Constraints:** Optional in some systems, but highly recommended for a professional environment. Max length.
    *   **Implementation Note:** Used in display names (e.g., "Welcome, [First Name]!"), notifications, and audit trails.

**Middle Name:**
*   **Purpose:** Additional personal identification, especially important in formal documents or larger organizations where first/last names might be duplicated.
*   **Details:**
    *   **Data Type:** String (`VARCHAR`).
    *   **Constraints:** Optional. Max length.
    *   **Implementation Note:** Should be `NULLABLE` in the database.

**Last Name:**
*   **Purpose:** Personal identification and sorting.
*   **Details:**
    *   **Data Type:** String (`VARCHAR`).
    *   **Constraints:** Highly recommended, often mandatory. Max length.
    *   **Implementation Note:** Used for display names, sorting user lists, and often combined with First Name.

**Suffix:**
*   **Purpose:** Formal identification (e.g., "Jr.", "Sr.", "III").
*   **Details:**
    *   **Data Type:** String (`VARCHAR`).
    *   **Constraints:** Optional. Max length.
    *   **Implementation Note:** Should be `NULLABLE`.

**Email Address:**
*   **Purpose:** Primary communication channel for system notifications, password resets, and often used as an alternative login identifier. Essential for collaboration.
*   **Details:**
    *   **Data Type:** String (`VARCHAR`).
    *   **Constraints:** Must be unique for the system (or unique per active user). Valid email format.
    *   **Implementation Note:** Django's `email` field often has built-in validation. Crucial for the "Inform Mechanism" (notifications).

**Address (Optional but Recommended):**
*   **Purpose:** For organizational records, particularly in larger enterprises or for compliance reasons.
*   **Details:**
    *   **Data Type:** Text (`TEXT`) or individual string fields for `Street`, `City`, `State/Province`, `Postal Code`, `Country`. The latter is more structured for reporting.
    *   **Constraints:** Optional.
    *   **Implementation Note:** Can be stored in a separate `UserProfile` model linked to `CustomUser` if too many optional fields accumulate.

**Contact Information (Optional but Recommended):**
*   **Purpose:** To facilitate direct communication within the organization.
*   **Details:**
    *   **Data Type:** String (`VARCHAR`) for phone number(s), potentially a separate `JSONField` or `TEXT` field for multiple contact methods (e.g., office phone, mobile, internal chat ID).
    *   **Constraints:** Optional. Specific format validation for phone numbers might be useful.
    *   **Implementation Note:** Useful for collaboration features, allowing users to quickly find contact details of document owners or workflow participants.

**Organizational Context:**
*   **Purpose:** To provide additional organizational details about the user that might influence their work or reporting.
*   **Details:**
    *   **Data Type:** `TEXT` or separate `VARCHAR` fields.
    *   **Possible Fields:** `Job Title`, `Employee ID`, `Start Date`, `Manager_id` (ForeignKey to `users_customuser.id` for reporting line).
    *   **Constraints:** Optional.
    *   **Implementation Note:** Useful for internal directories, reporting structures, and potentially for more advanced workflow routing based on job title.

**Account Status/Activity:**
*   **Purpose:** For system administration, security, and auditing.
*   **Details:**
    *   **Account Status (Active/Inactive):**
        *   **Data Type:** `BOOLEAN`.
        *   **Purpose:** `TRUE` if the user can log in; `FALSE` if the account is temporarily suspended or permanently deactivated. Critical for security (e.g., deactivating ex-employees).
    *   **Last Login Date/Time:**
        *   **Data Type:** `TIMESTAMP WITH TIME ZONE`.
        *   **Purpose:** Tracks user activity, which can be crucial for identifying dormant accounts for cleanup, detecting unusual login patterns, and auditing.
    *   **Date Joined/Created:**
        *   **Data Type:** `TIMESTAMP WITH TIME ZONE`.
        *   **Purpose:** Records when the user account was first established in the system. Useful for onboarding tracking and account age.
    *   **Implementation Note:** These are primarily managed by the backend (Django's built-in `is_active`, `last_login`, `date_joined`).

**Profile Picture/Avatar (Optional):**
*   **Purpose:** Personalization and easier visual identification in collaborative contexts (e.g., comments, workflow tasks).
*   **Details:**
    *   **Data Type:** `ImageField` (Django). Stores a path to an image file.
    *   **Constraints:** Optional. File size and type restrictions.
    *   **Implementation Note:** Stored in `MEDIA_ROOT`. Can default to a generic avatar if not provided.

**Time Zone / Locale (Optional):**
*   **Purpose:** To display dates and times in the user's local time zone and to provide language/regional formatting preferences.
*   **Details:**
    *   **Data Type:** String (`VARCHAR`) for time zone (e.g., "America/New_York") and locale (e.g., "en-US", "es-ES").
    *   **Constraints:** Optional. Default to server time zone or system default.
    *   **Implementation Note:** Crucial for accurate display of timestamps (e.g., `created_at`, `updated_at`, `notification_time`) for users in different geographical locations.

**Two-Factor Authentication (MFA) Status:**
*   **Purpose:** To indicate whether the user has enabled an additional layer of security beyond their password.
*   **Details:**
    *   **Data Type:** `BOOLEAN`.
    *   **Purpose:** `TRUE` if MFA is configured and active for the user; `FALSE` otherwise.
    *   **Implementation Note:** Directly maps to the `mfa_enabled` field in `users_customuser`. Controlled by the user (via settings) and potentially mandated by System Administrators. This is a key part of the "Security Hardening" phase.

---

This comprehensive breakdown should provide all the necessary information to design the user profile management features effectively, from the database schema to the user interface.