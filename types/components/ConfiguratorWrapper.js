import { jsx as _jsx } from "react/jsx-runtime";
import { useEmbodee } from '../hooks/useEmbodee';
import ErrorBoundary from './ErrorBoundary';
import ConfiguratorLoading from './ConfiguratorLoading';
import ConfiguratorError from './ConfiguratorError';
import LoadingOverlay from './LoadingOverlay';
/**
 * Main wrapper component that handles loading states and errors for the configurator
 */
export const ConfiguratorWrapper = ({ children, className = '', showRetryButton: _showRetryButton = true, onError }) => {
    const { isLoading, error, isRetrying, retryCount, retry, isInitialized } = useEmbodee();
    const handleError = (error, errorInfo) => {
        console.error('ConfiguratorWrapper caught an error:', error, errorInfo);
        if (onError) {
            onError(error, errorInfo);
        }
    };
    // Show loading state
    if (isLoading || isRetrying) {
        return (_jsx(ConfiguratorLoading, { isLoading: isLoading, isRetrying: isRetrying, retryCount: retryCount, className: className }));
    }
    // Show error state
    if (error) {
        return (_jsx(ConfiguratorError, { error: error, isRetrying: isRetrying, retryCount: retryCount, onRetry: retry, className: className }));
    }
    // Show content with error boundary
    return (_jsx(ErrorBoundary, { onError: handleError, className: className, children: _jsx(LoadingOverlay, { isLoading: !isInitialized, message: "Initializing 3D viewer...", className: "min-h-[400px]", children: children }) }));
};
export default ConfiguratorWrapper;
