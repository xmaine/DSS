These are excellent, comprehensive rules! I've refined them for clarity, conciseness, and a slightly more active voice, while also organizing them into logical sections with clear headings and emojis. I've also added a new section for best practices.

Here's the refined version:

🚀 Global Project Guidelines: Document Solutions
🎯 Project Understanding & Context

Start Every Interaction with QPLAN.md: Always review this file to grasp the project's vision, architecture, and constraints.

Consult QTASK.md Before Starting: Before tackling any new work, check QTASK.md. If your task isn't listed, add it with a concise description and the current date.

Maintain Consistency: Adhere strictly to the naming conventions, file structure, and architectural patterns outlined in QPLAN.md.

🏗️ Code Structure & Modularity

Keep Files Concise (<500 lines): Never let a file exceed 500 lines of code. Refactor proactively by splitting into smaller, focused modules or helper files.

Organize by Feature/Responsibility: Structure code into clearly separated modules, grouping related functionality.

Use Clear, Consistent Imports: Prefer relative imports within packages for better readability and maintainability.

🧪 Testing & Reliability

Prioritize Unit Tests: For every new feature (function, class, API route), create corresponding pytest unit tests.

Update Tests with Logic Changes: Whenever core logic is modified, review and update existing unit tests to ensure continued validity.

Mirror App Structure in Tests: Place tests in a /tests directory that mirrors the main application's file structure.

Comprehensive Test Coverage: For each unit, include at least:

1 test for expected successful execution.

1 test covering an edge case scenario.

1 test verifying a failure case (e.g., invalid input).

✅ Task Management

Immediate Task Completion Marking: Mark tasks as complete in QTASK.md as soon as they are finished.

Document New Discoveries: Add any new sub-tasks or TODOs identified during development to QTASK.md under a dedicated "Discovered During Work" section.

✍️ Style & Conventions

Primary Language: Python: All development will be in Python.

Adhere to PEP8 & Formatting: Follow PEP8 guidelines, use type hints, and format all code with black.

Data Validation with Pydantic: Utilize pydantic for robust data validation across the project.

API & ORM Standards: Use FastAPI for API development and SQLAlchemy or SQLModel for Object-Relational Mapping where applicable.

Google-Style Docstrings: Every function must have a Google-style docstring:

code
Python
download
content_copy
expand_less
def example(param1: str) -> bool:
    """
    Brief summary of what the function does.
    
    Args:
        param1 (str): Description of the first parameter.
        
    Returns:
        bool: Description of what the function returns.
    """
📚 Documentation & Explainability

Maintain README.md: Keep README.md updated with new features, dependency changes, and modified setup instructions.

Comment Non-Obvious Code: Ensure all code is understandable to a mid-level developer; add comments for complex or non-obvious logic.

Explain "Why" with # Reason:: For intricate or critical logic, include an inline # Reason: comment to explain the underlying rationale, not just the procedural steps.

🧠 AI Interaction & Best Practices

Never Assume, Always Ask: If context is missing or uncertain, always ask clarifying questions rather than making assumptions.

Use Verified Libraries Only: Do not hallucinate or use non-existent Python libraries or functions. Stick to known, verified packages.

Confirm File Paths & Modules: Before referencing any file paths or module names in code or tests, always confirm their existence.

No Uninstructed Deletions/Overwrites: Never delete or overwrite existing code unless explicitly instructed or if it's a direct requirement of a task from QTASK.md.

Iterate and Propose: When faced with a complex problem, break it down, propose a solution, and be ready to iterate based on feedback.

Provide Code Snippets: When discussing implementation details, provide relevant code snippets to illustrate your points.

I think these refinements make your rules even more effective! Let me know if you'd like any further adjustments.