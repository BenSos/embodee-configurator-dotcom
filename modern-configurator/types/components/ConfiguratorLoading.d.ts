import React from 'react';
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
export declare const ConfiguratorLoading: React.FC<ConfiguratorLoadingProps>;
export default ConfiguratorLoading;
//# sourceMappingURL=ConfiguratorLoading.d.ts.map