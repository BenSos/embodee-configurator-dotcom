import { URLParams } from '../types';
export interface FallbackConfig {
    workspaceID: string;
    productID: string;
    host: string;
    width: string;
    height: string;
    variant: string;
    designID: string;
}
export interface FallbackStrategy {
    useEnvironmentDefaults: boolean;
    useLocalStorage: boolean;
    useQueryParams: boolean;
    useHardcodedDefaults: boolean;
}
/**
 * Fallback configuration manager
 */
export declare class FallbackConfigManager {
    private config;
    private strategy;
    constructor(strategy?: Partial<FallbackStrategy>);
    /**
     * Load fallback configuration from various sources
     */
    private loadFallbackConfig;
    /**
     * Get fallback configuration
     */
    getConfig(): FallbackConfig;
    /**
     * Update fallback configuration
     */
    updateConfig(newConfig: Partial<FallbackConfig>): void;
    /**
     * Apply fallbacks to URL parameters
     */
    applyFallbacks(params: Partial<URLParams>): URLParams;
    /**
     * Validate fallback configuration
     */
    validateConfig(): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Reset to default configuration
     */
    reset(): void;
    /**
     * Get configuration summary for debugging
     */
    getSummary(): {
        config: FallbackConfig;
        strategy: FallbackStrategy;
        validation: {
            isValid: boolean;
            errors: string[];
        };
        sources: string[];
    };
}
export declare const fallbackManager: FallbackConfigManager;
export declare function getFallbackConfig(): FallbackConfig;
export declare function updateFallbackConfig(config: Partial<FallbackConfig>): void;
export declare function applyFallbacksToParams(params: Partial<URLParams>): URLParams;
export declare function validateFallbackConfig(): {
    isValid: boolean;
    errors: string[];
};
export declare function getFallbackSummary(): {
    config: FallbackConfig;
    strategy: FallbackStrategy;
    validation: {
        isValid: boolean;
        errors: string[];
    };
    sources: string[];
};
export default fallbackManager;
//# sourceMappingURL=fallbackConfig.d.ts.map