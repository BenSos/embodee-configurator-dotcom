# Embodee Product Configurator

A modern, React-based product configurator built with TypeScript, Vite, and Tailwind CSS, designed to integrate seamlessly with the Embodee 3D viewer API.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, TypeScript, and Vite
- **Embodee API Integration**: Complete integration with Embodee 3D viewer API
- **Robust Error Handling**: Comprehensive error boundaries and retry logic
- **Loading States**: Beautiful loading animations and state management
- **Fallback Mechanisms**: Intelligent fallback for missing parameters
- **Debug Logging**: Advanced logging system for development and debugging
- **Comprehensive Testing**: 27+ passing tests with Vitest
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, responsive styling

## 📁 Project Structure

```
embodee-configurator-2/
├── modern-configurator/          # Main React application
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   └── types/               # TypeScript type definitions
│   ├── public/                  # Static assets
│   └── scripts/                 # Build and development scripts
├── documentation/               # API documentation and examples
├── tasks/                      # Project task management
└── rules/                      # Development rules and guidelines
```

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest, React Testing Library
- **Build Tools**: Vite, TypeScript, ESLint, Prettier
- **API Integration**: Embodee 3D viewer API

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BenSos/embodee-configurator-dotcom.git
cd embodee-configurator-dotcom
```

2. Install dependencies:
```bash
cd modern-configurator
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:run` - Run tests once
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### Environment Variables

Create environment files for different environments:

- `env.development` - Development configuration
- `env.production` - Production configuration

### URL Parameters

The configurator accepts the following URL parameters:

- `workspaceID` - Embodee workspace identifier
- `productID` - Product identifier
- `variant` - Product variant (optional)
- `designID` - Design identifier (optional)
- `host` - API host URL (optional)
- `width` - Configurator width (optional)
- `height` - Configurator height (optional)

Example:
```
http://localhost:3000?workspaceID=my-workspace&productID=my-product&variant=Master
```

## 🧪 Testing

The project includes comprehensive testing with 27+ passing tests:

- **Unit Tests**: Individual component and utility function tests
- **Integration Tests**: Hook and API integration tests
- **Error Handling Tests**: Error boundary and retry logic tests

Run tests:
```bash
npm run test
```

## 📚 API Integration

### Embodee API Service

The `EmbodeeApiService` provides:

- **Product Data Fetching**: Retrieve product configuration data
- **Retry Logic**: Automatic retry with exponential backoff
- **Error Handling**: Comprehensive error management
- **Logging**: Detailed API call logging

### Custom Hooks

- **`useEmbodee`**: Main hook for configurator integration
- **State Management**: Loading, error, and configuration states
- **Event Handling**: 3D viewer event management

## 🎨 Components

### Loading Components
- `LoadingSpinner` - Animated loading spinner
- `LoadingOverlay` - Loading overlay for content
- `ConfiguratorLoading` - Specialized configurator loading

### Error Components
- `ErrorBoundary` - React error boundary
- `ConfiguratorError` - API error handling
- `ConfiguratorWrapper` - Main wrapper component

## 🔍 Debugging

### Logging System

The application includes a comprehensive logging system:

- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Categories**: API, CONFIGURATOR, ERROR, DEBUG
- **Storage**: In-memory log storage with configurable limits
- **Export**: JSON export for debugging

### Fallback Configuration

Intelligent fallback mechanisms:

- **Environment Defaults**: Development, staging, production
- **Local Storage**: User preference persistence
- **Query Parameters**: URL-based configuration
- **Hardcoded Defaults**: Safe fallback values

## 📖 Documentation

- **API Documentation**: Complete Embodee API integration guide
- **Component Documentation**: React component usage examples
- **Development Guide**: Setup and development instructions
- **Task Management**: Project progress tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Repository**: [https://github.com/BenSos/embodee-configurator-dotcom](https://github.com/BenSos/embodee-configurator-dotcom)
- **Embodee API**: [https://embodee.com](https://embodee.com)

## 📊 Project Status

### Completed Tasks ✅
- [x] 2.1 TypeScript types for Embodee API
- [x] 2.2 URL parameter parsing utility
- [x] 2.3 API service for fetching product data
- [x] 2.4 useEmbodee custom hook
- [x] 2.5 Error handling and retry logic
- [x] 2.6 Loading states and error boundaries
- [x] 2.7 Debug logging for API calls
- [x] 2.8 Fallback mechanism for default parameters

### Next Steps 🚀
- [ ] 3.0 3D product viewer component
- [ ] 3.1 EmbodeeLoader script integration
- [ ] 3.2 Real-time 3D model updates

---

Built with ❤️ using React, TypeScript, and modern web technologies.
