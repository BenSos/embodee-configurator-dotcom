import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

/**
 * Loading overlay component that shows a spinner over content when loading
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message,
  children,
  className = '',
  overlayClassName = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className={`absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 ${overlayClassName}`}>
          <LoadingSpinner size="lg" message={message} />
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
