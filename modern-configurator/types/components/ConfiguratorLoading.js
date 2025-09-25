import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LoadingSpinner from './LoadingSpinner';
/**
 * Loading component specifically for the configurator with retry status
 */
export const ConfiguratorLoading = ({ isLoading, isRetrying, retryCount, message, className = '' }) => {
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
    return (_jsxs("div", { className: `flex flex-col items-center justify-center min-h-[400px] space-y-4 ${className}`, children: [_jsx(LoadingSpinner, { size: "lg", message: getLoadingMessage() }), isRetrying && retryCount > 0 && (_jsxs("div", { className: "text-sm text-gray-500 text-center", children: [_jsx("p", { children: "Having trouble connecting to the configurator." }), _jsx("p", { children: "This usually resolves automatically." })] }))] }));
};
export default ConfiguratorLoading;
