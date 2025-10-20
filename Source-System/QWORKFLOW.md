### DOCUMENT SOLUTIONS: Defined Document Workflows by Role

These workflows illustrate the typical lifecycle of documents requiring collaboration and approval within the organizational hierarchy.

#### General Workflow Principles:

*   **Initiation:** Any user with `initiate_workflow` permission on a document can start a workflow.
*   **Sequential Steps:** Workflows progress through defined `dms_workflowstep`s, each with an `assigned_role` or `assigned_user_id` and a `required_action`.
*   **Tasks:** Each step generates a `dms_workflowtask` for the assigned user/role.
*   **Notifications:** `dms_notification`s are sent upon task assignment, completion, or workflow status changes.
*   **Status Tracking:** `dms_workflowinstance.status` tracks the overall progress (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `REJECTED`, `CANCELLED`).
*   **Rejection:** Rejection at any step can return the document to a previous step (e.g., initiator) or terminate the workflow.
*   **Oversight:** System Administrators and Senior Department Heads have visibility into all (or departmental) workflow instances and tasks.

---

#### Workflow 1: Employee to Department Head (Standard Document Approval)

**Scenario:** An Employee creates a document (e.g., a report, a proposal, an expense claim) that requires review and approval from their direct Department Head before finalization or broader dissemination.

**`dms_workflowtemplate` Example: "Standard Departmental Approval"**

1.  **Step 1: Document Creation & Initial Draft**
    *   **Initiator:** **Employee**
    *   **Action:** Employee uploads `dms_document` (`document.uploader_id = employee_id`).
    *   **Trigger:** Employee selects "Start Workflow" from the document's context menu and chooses "Standard Departmental Approval." This creates a `dms_workflowinstance`.

2.  **Step 2: Department Head Review & Approval**
    *   **`dms_workflowstep` Details:**
        *   `step_order`: 1
        *   `name`: "Department Head Review"
        *   `assigned_role`: `DEPT_HEAD` (specifically, the head of the initiator's department or the department owning the document's folder).
        *   `required_action`: `APPROVE` or `REJECT_WITH_COMMENT`
        *   `duration_days`: 3 (example)
    *   **Task Assignment:** A `dms_workflowtask` is created for the relevant Department Head.
    *   **Department Head Action:**
        *   Receives `dms_notification` in "My Workflow Tasks."
        *   Views the document, potentially adds `dms_annotation`s.
        *   Chooses "Approve" (workflow proceeds) or "Reject" (workflow typically returns to Employee with `comment` or terminates).

3.  **Step 3: (Optional) Employee Revision**
    *   **`dms_workflowstep` Details (if rejected at Step 2):**
        *   `step_order`: 2
        *   `name`: "Employee Revision"
        *   `assigned_user_id`: `employee_id` (the original initiator)
        *   `required_action`: `EDIT` & `RESUBMIT`
        *   `duration_days`: 2
    *   **Employee Action:**
        *   Receives `dms_notification` with rejection comments.
        *   Makes necessary edits (`dms_documentversion` created).
        *   Chooses "Resubmit for Approval" (workflow returns to Step 2).

4.  **Step 4: Workflow Completion**
    *   **`dms_workflowstep` Details (if approved at Step 2):**
        *   `step_order`: 2 (or 3 if revision step existed)
        *   `name`: "Document Approved"
        *   `assigned_role`: `SYSTEM` (auto-completed)
        *   `required_action`: `NONE` (marks document as approved)
    *   **System Action:** `dms_workflowinstance.status` set to `COMPLETED`.
    *   **Notification:** `dms_notification` sent to Employee and Department Head that document is approved.
    *   **Post-Completion:** Approved documents might automatically change `dms_guardian` permissions to "view" for a wider audience (e.g., entire department).

---

#### Workflow 2: Department Head to Employee (Document Assignment/Delegation)

**Scenario:** A Department Head wants an Employee to review, update, or create a specific document.

**`dms_workflowtemplate` Example: "Document Task Assignment"**

1.  **Step 1: Department Head Assigns Task**
    *   **Initiator:** **Department Head**
    *   **Action:** Department Head creates a new `dms_document` (e.g., a template) or selects an existing one. From its context menu, they select "Start Workflow" and choose "Document Task Assignment," specifying an `assigned_user_id` (Employee).

2.  **Step 2: Employee Action on Document**
    *   **`dms_workflowstep` Details:**
        *   `step_order`: 1
        *   `name`: "Employee Document Action"
        *   `assigned_user_id`: `employee_id` (specified by DH)
        *   `required_action`: `EDIT` & `COMPLETE_TASK` or `VIEW_AND_COMMENT`
        *   `duration_days`: 5
    *   **Task Assignment:** A `dms_workflowtask` is created for the assigned Employee.
    *   **Employee Action:**
        *   Receives `dms_notification`.
        *   Accesses the document, performs required `EDIT` (creating `dms_documentversion`s) or adds `dms_annotation`s.
        *   Chooses "Complete Task" (with optional `comment`).

3.  **Step 3: Department Head Final Review (Optional)**
    *   **`dms_workflowstep` Details:**
        *   `step_order`: 2
        *   `name`: "Department Head Final Review"
        *   `assigned_user_id`: `department_head_id` (original initiator)
        *   `required_action`: `REVIEW` & `MARK_FINAL` or `REQUEST_REVISION`
        *   `duration_days`: 2
    *   **Task Assignment:** A `dms_workflowtask` is created for the Department Head.
    *   **Department Head Action:** Reviews the employee's work.
        *   Chooses "Mark Final" (`dms_workflowinstance.status` set to `COMPLETED`).
        *   Chooses "Request Revision" (workflow returns to Step 2 for the Employee).

---

#### Workflow 3: Department Head to Senior Department Head (Cross-Departmental or Higher-Level Approval)

**Scenario:** A Department Head has a document (e.g., annual budget, strategic plan, inter-departmental policy) that requires approval from their Senior Department Head.

**`dms_workflowtemplate` Example: "Senior Management Approval"**

1.  **Step 1: Document Preparation & Review**
    *   **Initiator:** **Department Head** (or Employee in a prior workflow, which then automatically triggers this workflow).
    *   **Action:** Department Head ensures the `dms_document` is finalized at their level. Selects "Start Workflow" and chooses "Senior Management Approval."

2.  **Step 2: Senior Department Head Review & Approval**
    *   **`dms_workflowstep` Details:**
        *   `step_order`: 1
        *   `name`: "Senior Department Head Approval"
        *   `assigned_role`: `SENIOR_DEPT_HEAD` (specifically, the head of the DH's parent department, or designated SDH).
        *   `required_action`: `APPROVE` or `REJECT_WITH_COMMENT`
        *   `duration_days`: 4
    *   **Task Assignment:** A `dms_workflowtask` is created for the relevant Senior Department Head.
    *   **Senior Department Head Action:**
        *   Receives `dms_notification`.
        *   Reviews document.
        *   Chooses "Approve" (workflow proceeds to completion).
        *   Chooses "Reject" (workflow returns to Department Head with `comment` for revision).

3.  **Step 3: (Optional) Department Head Revision**
    *   **`dms_workflowstep` Details (if rejected at Step 2):**
        *   `step_order`: 2
        *   `name`: "Department Head Revision"
        *   `assigned_user_id`: `department_head_id` (the original initiator)
        *   `required_action`: `EDIT` & `RESUBMIT`
        *   `duration_days`: 3
    *   **Department Head Action:** Makes revisions and "Resubmits."

4.  **Step 4: Workflow Completion**
    *   **System Action:** `dms_workflowinstance.status` set to `COMPLETED`.
    *   **Notification:** `dms_notification` sent to Department Head and Senior Department Head.

---

#### Oversight Responsibilities

*   **System Administrator (God Mode / Global Oversight):**
    *   **Visibility:** Can view **all** `dms_workflowinstance`s and `dms_workflowtask`s across the entire system.
    *   **Intervention:** Has the capability to intervene in any workflow (e.g., reassign tasks, force complete steps, cancel workflows) for troubleshooting, audit purposes, or critical business needs. This involves direct modification of `dms_workflowtask` and `dms_workflowinstance` statuses.
    *   **Reporting:** Can generate reports on workflow efficiency, bottlenecks, and user performance.
    *   **Configuration:** Manages `dms_workflowtemplate`s.

*   **Senior Department Head (Departmental Oversight):**
    *   **Visibility:** Can view all `dms_workflowinstance`s and `dms_workflowtask`s related to documents within their assigned top-level department and its sub-departments. This includes workflows initiated by Department Heads and Employees under their purview.
    *   **Intervention (Limited):** May have explicit permission (granted by System Admin) to intervene in workflows within their departmental scope, such as reassigning tasks or escalating overdue tasks, but generally not to the same extent as a System Admin. This allows them to unblock processes without requiring full admin access.
    *   **Reporting:** Can monitor workflow statuses and task completion rates for their department, identifying high-performing or struggling areas.

---

This framework details the typical workflows, clearly assigning responsibilities based on the `QPLAN.md` roles and utilizing the `dms_workflow` tables effectively. The oversight mechanisms ensure accountability and provide necessary controls for management and administration.