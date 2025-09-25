import React from 'react';

interface ConfiguratorErrorProps {
  error: string | null;
  isRetrying: boolean;
  retryCount: number;
  onRetry: () => void;
  className?: string;
}

/**
 * Error component specifically for configurator API errors
 */
export const ConfiguratorError: React.FC<ConfiguratorErrorProps> = ({
  error,
  isRetrying,
  retryCount,
  onRetry,
  className = ''
}) => {
  if (!error) {
    return null;
  }

  const getErrorMessage = () => {
    if (isRetrying) {
      return `Retrying... (${retryCount}/3)`;
    }
    return error;
  };

  const getErrorType = () => {
    if (error.includes('Invalid workspaceID') || error.includes('Invalid productID')) {
      return 'configuration';
    }
    if (error.includes('Network') || error.includes('timeout')) {
      return 'network';
    }
    if (error.includes('3D viewer script failed to load')) {
      return 'script';
    }
    return 'general';
  };

  const errorType = getErrorType();

  const getErrorIcon = () => {
    switch (errorType) {
      case 'configuration':
        return (
          <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
          </svg>
        );
      case 'script':
        return (
          <svg className="w-16 h-16 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'configuration':
        return 'Configuration Error';
      case 'network':
        return 'Connection Error';
      case 'script':
        return '3D Viewer Error';
      default:
        return 'Configurator Error';
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case 'configuration':
        return 'The workspace or product ID is invalid. Please check your configuration.';
      case 'network':
        return 'Unable to connect to the configurator service. Please check your internet connection.';
      case 'script':
        return 'The 3D viewer failed to load. This may be due to browser compatibility or network issues.';
      default:
        return 'An unexpected error occurred while loading the configurator.';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-6 text-center ${className}`}>
      <div className="max-w-md">
        <div className="mb-4">
          {getErrorIcon()}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {getErrorTitle()}
        </h2>
        
        <p className="text-gray-600 mb-4">
          {getErrorDescription()}
        </p>
        
        <div className="text-sm text-gray-500 mb-4">
          {getErrorMessage()}
        </div>
        
        <div className="space-x-3">
          {!isRetrying && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguratorError;
