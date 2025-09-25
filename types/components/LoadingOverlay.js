import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LoadingSpinner from './LoadingSpinner';
/**
 * Loading overlay component that shows a spinner over content when loading
 */
export const LoadingOverlay = ({ isLoading, message, children, className = '', overlayClassName = '' }) => {
    return (_jsxs("div", { className: `relative ${className}`, children: [children, isLoading && (_jsx("div", { className: `absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 ${overlayClassName}`, children: _jsx(LoadingSpinner, { size: "lg", message: message || '' }) }))] }));
};
export default LoadingOverlay;
