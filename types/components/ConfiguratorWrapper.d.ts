import React from 'react';
interface ConfiguratorWrapperProps {
    children: React.ReactNode;
    className?: string;
    showRetryButton?: boolean;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
/**
 * Main wrapper component that handles loading states and errors for the configurator
 */
export declare const ConfiguratorWrapper: React.FC<ConfiguratorWrapperProps>;
export default ConfiguratorWrapper;
//# sourceMappingURL=ConfiguratorWrapper.d.ts.map