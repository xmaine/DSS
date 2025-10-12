# Document Solutions - Document Management System

A robust, user-friendly, and secure Document Management System (DMS) built with Django and React.

## Project Overview

This system provides a centralized platform for storing, organizing, searching, accessing, sharing, and managing documents. It's designed primarily for internal organizational needs on desktop and laptop machines.

## Project Structure

```
.
├── SOURCE/
│   ├── QPLAN.md          # Project planning and architecture
│   ├── QTASK.md          # Development tasks and roadmap
│   ├── RULES.md          # Global development rules and guidelines
│   ├── UI_DESIGN_INTEGRATION.md # UI design integration plan
│   └── DesignRef.txt     # Original UI design reference
├── backend/
│   ├── documents/        # Core document management Django app
│   ├── processing/       # Document processing Django app
│   └── manage.py         # Django management script
├── frontend/
│   ├── src/
│   │   ├── components/   # React components organized by function
│   │   ├── api/          # API configuration
│   │   └── App.js        # Main application component
│   └── README.md         # Frontend documentation
└── venv/                 # Python virtual environment
```

## Key Files

- [QPLAN.md](SOURCE/QPLAN.md) - Contains the high-level project planning, scope, technology stack, and design philosophy
- [QTASK.md](SOURCE/QTASK.md) - Detailed development tasks organized by phases
- [RULES.md](SOURCE/RULES.md) - Global development rules, coding standards, and conventions
- [UI_DESIGN_INTEGRATION.md](SOURCE/UI_DESIGN_INTEGRATION.md) - Mapping of UI design to project requirements
- [DesignRef.txt](SOURCE/DesignRef.txt) - Original React UI design reference

## Technology Stack

- **Backend:** Django (Python)
- **Frontend:** React
- **Database:** PostgreSQL
- **API:** RESTful API (Django REST Framework)
- **Authentication:** Django's built-in authentication system
- **File Storage:** Local filesystem with future cloud storage integration
- **OCR:** Tesseract OCR engine
- **Machine Learning:** scikit-learn for automated tagging and classification

## Development Guidelines

All developers must follow the guidelines outlined in [RULES.md](SOURCE/RULES.md) which includes:
- Coding standards and conventions
- Testing requirements
- Documentation practices
- Task management procedures

## Frontend Component Structure

The React frontend is organized into reusable components:

- **Layout Components**: Sidebar, Header, Navigation Menu
- **UI Components**: DocumentTable, StatisticsPanel, UploadArea, Icons
- **Pages**: Dashboard, Documents, Inbox, etc.

For detailed information about the frontend components, see [frontend/README.md](frontend/README.md).

## Initial Layout Implementation

The initial layout has been implemented with:

- **Header**: System name "Document Solutions", centered search bar, notification bell with count, and profile icon
- **Navigation Menu**: Consistent height matching the header, menu items with icons (Dashboard, Documents, Folders, Settings), and active state highlighting
- **Sidebar**: Role-based navigation with different access levels for System Administrator, Senior Department Head, Department Head, and Employee roles
- **Main Content Area**: Dashboard with document tables and statistics
- **Right Sidebar**: Document actions, sharing options, and management panels

For a detailed summary of the initial layout implementation, see [INITIAL_LAYOUT_SUMMARY.md](SOURCE/INITIAL_LAYOUT_SUMMARY.md).

## Getting Started

Detailed setup instructions will be added here as the project develops.

## License

To be determined.