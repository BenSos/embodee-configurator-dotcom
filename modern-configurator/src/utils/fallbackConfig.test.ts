import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FallbackConfigManager, getFallbackConfig, updateFallbackConfig, applyFallbacksToParams } from './fallbackConfig';

describe('FallbackConfigManager', () => {
  let fallbackManager: FallbackConfigManager;
  let mockLocalStorage: any;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    // Mock process.env
    vi.stubEnv('NODE_ENV', 'test');

    fallbackManager = new FallbackConfigManager({
      useEnvironmentDefaults: false,
      useLocalStorage: false,
      useQueryParams: false,
      useHardcodedDefaults: true
    });
  });

  it('should create with default configuration', () => {
    const config = fallbackManager.getConfig();
    expect(config.workspaceID).toBe('demo-workspace');
    expect(config.productID).toBe('demo-product');
    expect(config.host).toBe('https://embodee.com');
  });

  it('should update configuration', () => {
    fallbackManager.updateConfig({
      workspaceID: 'new-workspace',
      productID: 'new-product'
    });

    const config = fallbackManager.getConfig();
    expect(config.workspaceID).toBe('new-workspace');
    expect(config.productID).toBe('new-product');
  });

  it('should apply fallbacks to partial parameters', () => {
    const partialParams = {
      workspaceID: 'provided-workspace',
      // productID is missing, should use fallback
    };

    const result = fallbackManager.applyFallbacks(partialParams);
    
    expect(result.workspaceID).toBe('provided-workspace');
    expect(result.productID).toBe('demo-product'); // from fallback
    expect(result.host).toBe('https://embodee.com'); // from fallback
  });

  it('should validate configuration', () => {
    const validation = fallbackManager.validateConfig();
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should detect invalid configuration', () => {
    fallbackManager.updateConfig({
      workspaceID: '',
      productID: '',
      host: 'invalid-url'
    });

    const validation = fallbackManager.validateConfig();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('workspaceID is required');
    expect(validation.errors).toContain('productID is required');
    expect(validation.errors).toContain('host must be a valid URL');
  });

  it('should reset to default configuration', () => {
    fallbackManager.updateConfig({
      workspaceID: 'custom-workspace',
      productID: 'custom-product'
    });

    fallbackManager.reset();
    
    const config = fallbackManager.getConfig();
    expect(config.workspaceID).toBe('demo-workspace');
    expect(config.productID).toBe('demo-product');
  });

  it('should get configuration summary', () => {
    const summary = fallbackManager.getSummary();
    
    expect(summary.config).toBeDefined();
    expect(summary.strategy).toBeDefined();
    expect(summary.validation).toBeDefined();
    expect(summary.sources).toContain('hardcoded');
  });

  it('should use localStorage when enabled', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      workspaceID: 'stored-workspace',
      productID: 'stored-product'
    }));

    const manager = new FallbackConfigManager({
      useLocalStorage: true,
      useHardcodedDefaults: true
    });

    const config = manager.getConfig();
    expect(config.workspaceID).toBe('stored-workspace');
    expect(config.productID).toBe('stored-product');
  });

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const manager = new FallbackConfigManager({
      useLocalStorage: true,
      useHardcodedDefaults: true
    });

    // Should not throw and should use hardcoded defaults
    const config = manager.getConfig();
    expect(config.workspaceID).toBe('demo-workspace');
  });

  it('should save to localStorage when updating config', () => {
    const manager = new FallbackConfigManager({
      useLocalStorage: true,
      useHardcodedDefaults: true
    });

    manager.updateConfig({
      workspaceID: 'new-workspace'
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'embodee-fallback-config',
      expect.stringContaining('"workspaceID":"new-workspace"')
    );
  });
});

describe('Fallback utility functions', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
  });

  it('should get fallback config', () => {
    const config = getFallbackConfig();
    expect(config).toBeDefined();
    expect(config.workspaceID).toBeDefined();
    expect(config.productID).toBeDefined();
  });

  it('should update fallback config', () => {
    updateFallbackConfig({
      workspaceID: 'utility-workspace'
    });

    const config = getFallbackConfig();
    expect(config.workspaceID).toBe('utility-workspace');
  });

  it('should apply fallbacks to params', () => {
    const partialParams = {
      workspaceID: 'provided-workspace'
    };

    const result = applyFallbacksToParams(partialParams);
    
    expect(result.workspaceID).toBe('provided-workspace');
    expect(result.productID).toBeDefined();
    expect(result.host).toBeDefined();
  });
});
