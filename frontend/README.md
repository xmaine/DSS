# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Component Structure

The React frontend is organized into the following directory structure:

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Header, etc.)
│   │   ├── Sidebar.js
│   │   └── ...
│   ├── ui/              # Reusable UI components
│   │   ├── Icons.js
│   │   ├── DocumentTable.js
│   │   ├── StatisticsPanel.js
│   │   ├── UploadArea.js
│   │   └── ...
│   ├── pages/           # Page components for different sections
│   │   ├── DashboardPage.js
│   │   ├── DocumentsPage.js
│   │   └── ...
│   ├── App.js           # Main application component
│   └── App.css          # Component-specific styles
├── api/                 # API configuration
└── ...
```

## UI Design Integration

This frontend implementation is based on the DesignRef.txt specification which provides:

1. **Responsive Layout**: Mobile-friendly design with collapsible sidebar
2. **Component-Based Architecture**: Reusable components for consistent UI
3. **Modern Styling**: Clean, professional appearance using Tailwind CSS
4. **Intuitive Navigation**: Clear section organization and user flows

## Integration with Backend

The frontend is designed to work with the Django REST API backend. Key integration points include:

1. **API Configuration**: Located in `src/api/config.js`
2. **Data Fetching**: Using axios for HTTP requests
3. **State Management**: Using React hooks (useState, useEffect)
4. **Form Handling**: Controlled components with validation

## Development Guidelines

When working on the frontend, please follow these guidelines:

1. **Component Reusability**: Create reusable components when possible
2. **Consistent Styling**: Use Tailwind CSS classes for consistent appearance
3. **Accessibility**: Ensure components are accessible to all users
4. **Performance**: Optimize components for fast rendering
5. **Testing**: Write unit tests for complex components

## Next Steps

1. Connect components to real API endpoints
2. Implement state management for complex interactions
3. Add error handling and loading states
4. Implement proper routing between pages
5. Add unit tests for components