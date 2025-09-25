import React from 'react';
import { useEmbodee } from '../hooks/useEmbodee';
import ErrorBoundary from './ErrorBoundary';
import ConfiguratorLoading from './ConfiguratorLoading';
import ConfiguratorError from './ConfiguratorError';
import LoadingOverlay from './LoadingOverlay';

interface ConfiguratorWrapperProps {
  children: React.ReactNode;
  className?: string;
  showRetryButton?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Main wrapper component that handles loading states and errors for the configurator
 */
export const ConfiguratorWrapper: React.FC<ConfiguratorWrapperProps> = ({
  children,
  className = '',
  showRetryButton = true,
  onError
}) => {
  const {
    isLoading,
    error,
    isRetrying,
    retryCount,
    retry,
    isInitialized
  } = useEmbodee();

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('ConfiguratorWrapper caught an error:', error, errorInfo);
    if (onError) {
      onError(error, errorInfo);
    }
  };

  // Show loading state
  if (isLoading || isRetrying) {
    return (
      <ConfiguratorLoading
        isLoading={isLoading}
        isRetrying={isRetrying}
        retryCount={retryCount}
        className={className}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <ConfiguratorError
        error={error}
        isRetrying={isRetrying}
        retryCount={retryCount}
        onRetry={retry}
        className={className}
      />
    );
  }

  // Show content with error boundary
  return (
    <ErrorBoundary onError={handleError} className={className}>
      <LoadingOverlay
        isLoading={!isInitialized}
        message="Initializing 3D viewer..."
        className="min-h-[400px]"
      >
        {children}
      </LoadingOverlay>
    </ErrorBoundary>
  );
};

export default ConfiguratorWrapper;
