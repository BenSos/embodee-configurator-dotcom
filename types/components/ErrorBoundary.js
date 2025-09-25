import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
/**
 * Error boundary component to catch and handle React errors
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null
                });
            }
        });
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });
        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
        // Log error to console in development
        if (process.env['NODE_ENV'] === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: `flex flex-col items-center justify-center min-h-[400px] p-6 text-center ${this.props.className || ''}`, children: _jsxs("div", { className: "max-w-md", children: [_jsx("div", { className: "mb-4", children: _jsx("svg", { className: "w-16 h-16 mx-auto text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-gray-600 mb-4", children: "The configurator encountered an unexpected error. Please try refreshing the page." }), process.env['NODE_ENV'] === 'development' && this.state.error && (_jsxs("details", { className: "mb-4 text-left", children: [_jsx("summary", { className: "cursor-pointer text-sm text-gray-500 hover:text-gray-700", children: "Error Details" }), _jsxs("pre", { className: "mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto", children: [this.state.error.toString(), this.state.errorInfo?.componentStack] })] })), _jsxs("div", { className: "space-x-3", children: [_jsx("button", { onClick: this.handleRetry, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", children: "Try Again" }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2", children: "Refresh Page" })] })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
