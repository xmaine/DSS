# Frontend Components

This directory contains the React components for the Document Solutions frontend, organized according to the DesignRef.txt specification.

## Directory Structure

```
components/
├── layout/          # Layout components (Sidebar, Header, etc.)
├── ui/              # Reusable UI components (Buttons, Tables, Forms, etc.)
├── pages/           # Page components for different sections
├── App.js           # Main application component
└── App.css          # Component-specific styles
```

## Component Overview

### Layout Components
- **Sidebar.js**: Main navigation sidebar with collapsible sections
- **Header.js**: Top application bar with search and user menu

### UI Components
- **Icons.js**: SVG icon components used throughout the application
- **DocumentTable.js**: Reusable table component for displaying document lists
- **StatisticsPanel.js**: Component for displaying system statistics
- **UploadArea.js**: Drag-and-drop file upload component

### Pages
- **DashboardPage.js**: Main dashboard view
- **DocumentsPage.js**: Document management interface
- **InboxPage.js**: Document inbox view
- **RecentPage.js**: Recently added documents view
- **TagsPage.js**: Tag management interface
- **CorrespondentsPage.js**: Correspondent management interface
- **SettingsPage.js**: System settings interface
- **UsersPage.js**: User and group management interface

## Integration with Backend

Components are designed to work with the Django REST API. API integration is handled through:

1. **API Configuration**: Located in `../api/config.js`
2. **Data Fetching**: Using axios for HTTP requests
3. **State Management**: Using React hooks (useState, useEffect)

## Design Principles

1. **Component Reusability**: Components are designed to be reusable across different sections
2. **Responsive Design**: All components are mobile-friendly
3. **Accessibility**: Components follow accessibility best practices
4. **Consistent Styling**: Using Tailwind CSS for consistent styling

## Next Steps

1. Connect components to real API endpoints
2. Implement state management for complex interactions
3. Add error handling and loading states
4. Implement proper routing between pages
5. Add unit tests for components