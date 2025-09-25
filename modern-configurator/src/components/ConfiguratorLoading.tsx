import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ConfiguratorLoadingProps {
  isLoading: boolean;
  isRetrying: boolean;
  retryCount: number;
  message?: string;
  className?: string;
}

/**
 * Loading component specifically for the configurator with retry status
 */
export const ConfiguratorLoading: React.FC<ConfiguratorLoadingProps> = ({
  isLoading,
  isRetrying,
  retryCount,
  message,
  className = ''
}) => {
  if (!isLoading && !isRetrying) {
    return null;
  }

  const getLoadingMessage = () => {
    if (isRetrying && retryCount > 0) {
      return `Retrying... (${retryCount}/3)`;
    }
    if (message) {
      return message;
    }
    if (isRetrying) {
      return 'Initializing configurator...';
    }
    return 'Loading configurator...';
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] space-y-4 ${className}`}>
      <LoadingSpinner size="lg" message={getLoadingMessage()} />
      
      {isRetrying && retryCount > 0 && (
        <div className="text-sm text-gray-500 text-center">
          <p>Having trouble connecting to the configurator.</p>
          <p>This usually resolves automatically.</p>
        </div>
      )}
    </div>
  );
};

export default ConfiguratorLoading;
