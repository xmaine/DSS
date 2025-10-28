--- START OF FILE QRULES.md ---

🚀 Global Project Guidelines: Document Solutions
🎯 Project Understanding & Context

Start Every Interaction with QPLAN.md: Always review this file to grasp the project's vision, architecture, and constraints.

Consult QTASK.md Before Starting: Before tackling any new work, check QTASK.md. If your task isn't listed, add it with a concise description and the current date.

Maintain Consistency: Adhere strictly to the naming conventions, file structure, and architectural patterns outlined in QPLAN.md.

🏗️ Code Structure & Modularity

Keep Files Concise (<500 lines): Never let a file exceed 500 lines of code. Refactor proactively by splitting into smaller, focused modules or helper files.

Organize by Feature/Responsibility: Structure code into clearly separated modules, grouping related functionality.

Use Clear, Consistent Imports: Prefer relative imports within packages for better readability and maintainability.

Keep Code DRY (Don't Repeat Yourself): Write reusable functions, components, and utilities to avoid duplicating code.

Group Related Code: Place code with similar functionality together, whether in modules, classes, or components.

Refactor and Optimize: Continuously improve the internal structure, readability, and performance of your code without changing its external behavior.

🧹 Code Clarity & Readability

Use Descriptive Names: Choose meaningful, explicit names for variables, functions, classes, and components to make the code self-explanatory. Avoid single-letter or ambiguous identifiers.

Write Clear Comments: Add comments to explain the "why" behind complex, non-obvious logic or critical design decisions (`# Reason:`), but avoid over-commenting or explaining "what" the code already clearly says.

Maintain a Consistent Style: Adhere to a uniform formatting and style guide (e.g., PEP8 for Python, Prettier/ESLint for JS) throughout the project to improve readability and collaboration.

Avoid Complicated Nesting: Keep code simple and flat. Limit excessively nested loops, conditional statements, or callback structures. Refactor complex logic into smaller, well-named functions.

Keep Lines Short: Aim for shorter line lengths (e.g., 79-99 characters for Python, similar for JS/CSS) to make code easier to scan and read, reducing horizontal scrolling.

 Organize Files and Folders: Structure your project logically with clear, intuitive directories for different types of code (e.g., `models`, `views`, `services`, `components`, `api`, `tests`).

🧪 Testing & Reliability

Prioritize Unit Tests: For every new feature (function, class, API route, React component), create corresponding unit tests.

Update Tests with Logic Changes: Whenever core logic is modified, review and update existing unit tests to ensure continued validity and prevent regressions.

Mirror App Structure in Tests: Place tests in a dedicated `/tests` directory that mirrors the main application's file structure.

Comprehensive Test Coverage: For each unit, include at least:
    1 test for expected successful execution.
    1 test covering an edge case scenario.
    1 test verifying a failure case (e.g., invalid input, expected exception).

Handle Errors Appropriately: Implement robust error and exception handling mechanisms across both backend and frontend to prevent unexpected crashes and provide meaningful feedback to users or logs.

Validate All Inputs: Sanitize and validate all user and external data inputs (e.g., API requests, form submissions, environment variables) to prevent security vulnerabilities like injections or unexpected behavior.

Follow Security Principles: Adhere to fundamental security practices such as "default deny" (only allow what is explicitly permitted), "least privilege" (grant only necessary permissions), and "defense in depth" (multiple layers of security). Regularly review for common vulnerabilities (e.g., OWASP Top 10).

✅ Task Management

Immediate Task Completion Marking: Mark tasks as complete in QTASK.md as soon as they are finished.

Document New Discoveries: Add any new sub-tasks or TODOs identified during development to QTASK.md under a dedicated "Discovered During Work" section.

✍️ Style & Conventions

Primary Language: Python (Backend), JavaScript/TypeScript (Frontend): All development will primarily use Python for backend and JavaScript/TypeScript for frontend.

Adhere to PEP8 & Formatting (Python): Follow PEP8 guidelines, use type hints, and format all Python code with `black`.

Frontend Formatting (JS/React): Utilize tools like Prettier and ESLint for consistent formatting and style enforcement in JavaScript/React code.

Data Validation with Pydantic (Python): Utilize `pydantic` for robust data validation across the Python backend.

API & ORM Standards (Python): Use Django REST Framework for API development and Django's ORM for database interactions.

Google-Style Docstrings (Python): Every function, class, and method must have a Google-style docstring:

```python
def example(param1: str) -> bool:
    """
    Brief summary of what the function does.

    Args:
        param1 (str): Description of the first parameter.

    Returns:
        bool: Description of what the function returns.
    """
```

📚 Documentation & Explainability

Maintain README.md: Keep README.md updated with new features, dependency changes, setup instructions, and deployment steps.

Comment Non-Obvious Code: Ensure all code is understandable to a mid-level developer; add comments for complex or non-obvious logic.

Explain "Why" with # Reason:: For intricate, critical, or counter-intuitive logic, include an inline `# Reason:` comment to explain the underlying rationale or design choice, not just the procedural steps.

🧠 AI Interaction & Best Practices

Never Assume, Always Ask: If context is missing or uncertain, always ask clarifying questions rather than making assumptions.

Use Verified Libraries Only: Do not hallucinate or use non-existent Python/JavaScript libraries or functions. Stick to known, verified packages within the specified technology stack.

Confirm File Paths & Modules: Before referencing any file paths or module names in code or tests, always confirm their existence and correctness within the project structure.

No Uninstructed Deletions/Overwrites: Never delete or overwrite existing code unless explicitly instructed or if it's a direct requirement of a task from QTASK.md.

Iterate and Propose: When faced with a complex problem, break it down, propose a solution, and be ready to iterate based on feedback.

Provide Code Snippets: When discussing implementation details, provide relevant code snippets to illustrate your points.

🧑‍💻 Development Process

Plan Before Coding: Take time to thoroughly plan and design your solution, considering architecture, data flows, and potential edge cases, before you start writing code. Create diagrams or pseudocode if helpful.

Use Version Control (Git): Utilize Git for all code management. Commit frequently with clear, descriptive messages. Use branches for features and bug fixes, and ensure proper merge/rebase practices.

Write Tests: Implement unit, integration, and (where applicable) end-to-end tests to verify that your code functions as intended, catches regressions, and meets requirements.

Conduct Code Reviews: Actively participate in code reviews. Have other developers review your code to catch potential issues, ensure adherence to standards, share knowledge, and improve code quality. Provide constructive feedback on others' code.

--- END OF FILE QRULES.md ---

--- START OF FILE QTECHSTACK.md ---
## 🛠️ Project Technology Stack

This document outlines the core technologies and frameworks used across the project. Adherence to these specified technologies is mandatory.

### 📦 Backend

*   **Framework:** Django 5.2.7
*   **API Framework:** Django REST Framework (DRF)
*   **Database:** PostgreSQL (for robust data storage and retrieval)
*   **Language:** Python 3.11+
*   **Package Management:** `pip` with `virtualenv` for isolated environments.

### 🌐 Frontend

*   **Library:** React (for building dynamic user interfaces)
*   **Styling:** Tailwind CSS (for utility-first CSS styling)
*   **API Communication:** Axios (for making HTTP requests to the backend API)
*   **Language:** JavaScript (or TypeScript, if introduced later)
*   **Package Management:** `npm` or `yarn`

### ⚙️ DevOps & Development Environment

*   **Version Control:** Git
*   **Python Environment:** Virtual environment (e.g., `venv`)
*   **Code Formatting (Python):** `black`
*   **Linting (Python):** `flake8` or `ruff`
*   **Code Formatting & Linting (Frontend):** `Prettier`, `ESLint`

--- END OF FILE QTECHSTACK.md ---