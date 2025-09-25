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
export declare const ConfiguratorError: React.FC<ConfiguratorErrorProps>;
export default ConfiguratorError;
//# sourceMappingURL=ConfiguratorError.d.ts.map