// Fallback configuration utility for Embodee Product Configurator
// Provides intelligent fallback mechanisms for default parameters

import { URLParams } from '../types';
import { logger } from './logger';

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
 * Default fallback configuration
 */
const DEFAULT_FALLBACK_CONFIG: FallbackConfig = {
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
const ENVIRONMENT_FALLBACKS: Record<string, Partial<FallbackConfig>> = {
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
  private config: FallbackConfig;
  private strategy: FallbackStrategy;

  constructor(strategy: Partial<FallbackStrategy> = {}) {
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
  private loadFallbackConfig(): void {
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
      } catch (error) {
        logger.warn('FALLBACK', 'Failed to parse localStorage config', { error: (error as Error).message }, 'FallbackConfigManager');
      }
    }

    // 3. Query parameter defaults (from URL)
    if (this.strategy.useQueryParams && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryConfig: Partial<FallbackConfig> = {};
      
      if (urlParams.has('defaultWorkspace')) {
        queryConfig.workspaceID = urlParams.get('defaultWorkspace')!;
      }
      if (urlParams.has('defaultProduct')) {
        queryConfig.productID = urlParams.get('defaultProduct')!;
      }
      if (urlParams.has('defaultHost')) {
        queryConfig.host = urlParams.get('defaultHost')!;
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
  getConfig(): FallbackConfig {
    return { ...this.config };
  }

  /**
   * Update fallback configuration
   */
  updateConfig(newConfig: Partial<FallbackConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('FALLBACK', 'Fallback configuration updated', { config: newConfig }, 'FallbackConfigManager');
    
    // Save to localStorage if enabled
    if (this.strategy.useLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem('embodee-fallback-config', JSON.stringify(this.config));
        logger.debug('FALLBACK', 'Configuration saved to localStorage', {}, 'FallbackConfigManager');
      } catch (error) {
        logger.warn('FALLBACK', 'Failed to save to localStorage', { error: (error as Error).message }, 'FallbackConfigManager');
      }
    }
  }

  /**
   * Apply fallbacks to URL parameters
   */
  applyFallbacks(params: Partial<URLParams>): URLParams {
    const result: URLParams = {
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
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

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
    } catch {
      errors.push('host must be a valid URL');
    }

    const isValid = errors.length === 0;
    
    if (!isValid) {
      logger.warn('FALLBACK', 'Configuration validation failed', { errors }, 'FallbackConfigManager');
    } else {
      logger.debug('FALLBACK', 'Configuration validation passed', {}, 'FallbackConfigManager');
    }

    return { isValid, errors };
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.config = { ...DEFAULT_FALLBACK_CONFIG };
    this.loadFallbackConfig();
    logger.info('FALLBACK', 'Configuration reset to defaults', {}, 'FallbackConfigManager');
  }

  /**
   * Get configuration summary for debugging
   */
  getSummary(): {
    config: FallbackConfig;
    strategy: FallbackStrategy;
    validation: { isValid: boolean; errors: string[] };
    sources: string[];
  } {
    const sources: string[] = [];
    
    if (this.strategy.useEnvironmentDefaults) sources.push('environment');
    if (this.strategy.useLocalStorage) sources.push('localStorage');
    if (this.strategy.useQueryParams) sources.push('queryParams');
    if (this.strategy.useHardcodedDefaults) sources.push('hardcoded');

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
export function getFallbackConfig(): FallbackConfig {
  return fallbackManager.getConfig();
}

export function updateFallbackConfig(config: Partial<FallbackConfig>): void {
  fallbackManager.updateConfig(config);
}

export function applyFallbacksToParams(params: Partial<URLParams>): URLParams {
  return fallbackManager.applyFallbacks(params);
}

export function validateFallbackConfig(): { isValid: boolean; errors: string[] } {
  return fallbackManager.validateConfig();
}

export function getFallbackSummary() {
  return fallbackManager.getSummary();
}

export default fallbackManager;
