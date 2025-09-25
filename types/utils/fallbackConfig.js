// Fallback configuration utility for Embodee Product Configurator
// Provides intelligent fallback mechanisms for default parameters
import { logger } from './logger';
/**
 * Default fallback configuration
 */
const DEFAULT_FALLBACK_CONFIG = {
    workspaceID: 'demo-workspace',
    productID: 'demo-product',
    host: 'https://embodee.com',
    width: '100%',
    height: '600px',
    variant: 'Master',
    designID: 'false'
};
/**
 * Environment-specific fallback configurations
 */
const ENVIRONMENT_FALLBACKS = {
    development: {
        workspaceID: 'dev-workspace',
        productID: 'dev-product',
        host: 'https://dev.embodee.com'
    },
    staging: {
        workspaceID: 'staging-workspace',
        productID: 'staging-product',
        host: 'https://staging.embodee.com'
    },
    production: {
        workspaceID: 'prod-workspace',
        productID: 'prod-product',
        host: 'https://embodee.com'
    }
};
/**
 * Fallback configuration manager
 */
export class FallbackConfigManager {
    constructor(strategy = {}) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "strategy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.strategy = {
            useEnvironmentDefaults: true,
            useLocalStorage: true,
            useQueryParams: true,
            useHardcodedDefaults: true,
            ...strategy
        };
        this.config = { ...DEFAULT_FALLBACK_CONFIG };
        this.loadFallbackConfig();
    }
    /**
     * Load fallback configuration from various sources
     */
    loadFallbackConfig() {
        logger.debug('FALLBACK', 'Loading fallback configuration', { strategy: this.strategy }, 'FallbackConfigManager');
        // 1. Environment-specific defaults
        if (this.strategy.useEnvironmentDefaults) {
            const env = process.env['NODE_ENV'] || 'development';
            const envConfig = ENVIRONMENT_FALLBACKS[env];
            if (envConfig) {
                this.config = { ...this.config, ...envConfig };
                logger.debug('FALLBACK', 'Applied environment defaults', { env, config: envConfig }, 'FallbackConfigManager');
            }
        }
        // 2. Local storage defaults
        if (this.strategy.useLocalStorage && typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('embodee-fallback-config');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    this.config = { ...this.config, ...parsed };
                    logger.debug('FALLBACK', 'Applied localStorage defaults', { config: parsed }, 'FallbackConfigManager');
                }
            }
            catch (error) {
                logger.warn('FALLBACK', 'Failed to parse localStorage config', { error: error.message }, 'FallbackConfigManager');
            }
        }
        // 3. Query parameter defaults (from URL)
        if (this.strategy.useQueryParams && typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const queryConfig = {};
            if (urlParams.has('defaultWorkspace')) {
                queryConfig.workspaceID = urlParams.get('defaultWorkspace');
            }
            if (urlParams.has('defaultProduct')) {
                queryConfig.productID = urlParams.get('defaultProduct');
            }
            if (urlParams.has('defaultHost')) {
                queryConfig.host = urlParams.get('defaultHost');
            }
            if (Object.keys(queryConfig).length > 0) {
                this.config = { ...this.config, ...queryConfig };
                logger.debug('FALLBACK', 'Applied query parameter defaults', { config: queryConfig }, 'FallbackConfigManager');
            }
        }
    }
    /**
     * Get fallback configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update fallback configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        logger.info('FALLBACK', 'Fallback configuration updated', { config: newConfig }, 'FallbackConfigManager');
        // Save to localStorage if enabled
        if (this.strategy.useLocalStorage && typeof window !== 'undefined') {
            try {
                localStorage.setItem('embodee-fallback-config', JSON.stringify(this.config));
                logger.debug('FALLBACK', 'Configuration saved to localStorage', {}, 'FallbackConfigManager');
            }
            catch (error) {
                logger.warn('FALLBACK', 'Failed to save to localStorage', { error: error.message }, 'FallbackConfigManager');
            }
        }
    }
    /**
     * Apply fallbacks to URL parameters
     */
    applyFallbacks(params) {
        const result = {
            workspaceID: params.workspaceID || this.config.workspaceID,
            productID: params.productID || this.config.productID,
            host: params.host || this.config.host,
            width: params.width || this.config.width,
            height: params.height || this.config.height,
            variant: params.variant || this.config.variant,
            designID: params.designID || this.config.designID
        };
        logger.debug('FALLBACK', 'Applied fallbacks to parameters', {
            original: params,
            result,
            fallbacks: this.config
        }, 'FallbackConfigManager');
        return result;
    }
    /**
     * Validate fallback configuration
     */
    validateConfig() {
        const errors = [];
        if (!this.config.workspaceID || this.config.workspaceID.trim() === '') {
            errors.push('workspaceID is required');
        }
        if (!this.config.productID || this.config.productID.trim() === '') {
            errors.push('productID is required');
        }
        if (!this.config.host || this.config.host.trim() === '') {
            errors.push('host is required');
        }
        // Validate host URL format
        try {
            new URL(this.config.host);
        }
        catch {
            errors.push('host must be a valid URL');
        }
        const isValid = errors.length === 0;
        if (!isValid) {
            logger.warn('FALLBACK', 'Configuration validation failed', { errors }, 'FallbackConfigManager');
        }
        else {
            logger.debug('FALLBACK', 'Configuration validation passed', {}, 'FallbackConfigManager');
        }
        return { isValid, errors };
    }
    /**
     * Reset to default configuration
     */
    reset() {
        this.config = { ...DEFAULT_FALLBACK_CONFIG };
        this.loadFallbackConfig();
        logger.info('FALLBACK', 'Configuration reset to defaults', {}, 'FallbackConfigManager');
    }
    /**
     * Get configuration summary for debugging
     */
    getSummary() {
        const sources = [];
        if (this.strategy.useEnvironmentDefaults)
            sources.push('environment');
        if (this.strategy.useLocalStorage)
            sources.push('localStorage');
        if (this.strategy.useQueryParams)
            sources.push('queryParams');
        if (this.strategy.useHardcodedDefaults)
            sources.push('hardcoded');
        return {
            config: this.config,
            strategy: this.strategy,
            validation: this.validateConfig(),
            sources
        };
    }
}
// Default fallback manager instance
export const fallbackManager = new FallbackConfigManager();
// Utility functions
export function getFallbackConfig() {
    return fallbackManager.getConfig();
}
export function updateFallbackConfig(config) {
    fallbackManager.updateConfig(config);
}
export function applyFallbacksToParams(params) {
    return fallbackManager.applyFallbacks(params);
}
export function validateFallbackConfig() {
    return fallbackManager.validateConfig();
}
export function getFallbackSummary() {
    return fallbackManager.getSummary();
}
export default fallbackManager;
