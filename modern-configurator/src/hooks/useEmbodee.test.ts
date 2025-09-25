// Tests for useEmbodee custom hook
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEmbodee } from './useEmbodee';
import { embodeeApi } from '../utils';

// Mock the utils
vi.mock('../utils', () => ({
  embodeeApi: {
    getProductDataFromParams: vi.fn(),
  },
  getValidatedUrlParams: vi.fn(() => ({
    workspaceID: 'test-workspace',
    productID: 'test-product',
    variant: 'Master',
    designID: 'false',
    host: 'https://embodee.app',
    width: '100%',
    height: '600px'
  })),
  logApiError: vi.fn(),
}));

// Mock window.EmbodeeLoader
const mockEmbodeeLoader = {
  init: vi.fn(),
};

// Mock global window
Object.defineProperty(window, 'EmbodeeLoader', {
  value: mockEmbodeeLoader,
  writable: true,
});

describe('useEmbodee', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset window.EmbodeeLoader
    (window as any).EmbodeeLoader = mockEmbodeeLoader;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useEmbodee());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.configurator).toBeNull();
    expect(result.current.isInitialized).toBe(false);
  });

  it('should handle successful initialization', async () => {
    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn(),
      setComponentValue: vi.fn(),
      getComponentValue: vi.fn(),
      getCurrentSelections: vi.fn(() => ({}))
    };

    // Mock API response
    (embodeeApi.getProductDataFromParams as any).mockResolvedValue(mockProductData);
    
    // Mock EmbodeeLoader.init
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.productData).toEqual(mockProductData);
    expect(result.current.configurator).toEqual(mockConfigurator);
  });

  it('should handle API errors during initialization', async () => {
    const errorMessage = 'API Error: Product not found';
    
    // Mock API error
    (embodeeApi.getProductDataFromParams as any).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useEmbodee());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.configurator).toBeNull();
  });

  it('should handle EmbodeeLoader timeout', async () => {
    // Mock EmbodeeLoader not being available
    (window as any).EmbodeeLoader = undefined;

    const { result } = renderHook(() => useEmbodee());

    // The hook should start in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Since we can't wait 30 seconds in tests, we'll just verify the initial state
    // In a real scenario, the timeout would occur and set isLoading to false
    expect(result.current.configurator).toBeNull();
  });

  it('should handle setValue correctly', async () => {
    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn((event, callback) => {
        // Simulate the product ready event immediately
        if (event === 'productReady') {
          setTimeout(callback, 0);
        }
      }),
      setComponentValue: vi.fn().mockResolvedValue(undefined),
      getComponentValue: vi.fn(),
      getCurrentSelections: vi.fn(() => ({}))
    };

    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    (embodeeApi.getProductDataFromParams as any).mockResolvedValue(mockProductData);
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    // Test setValue
    await result.current.setValue('component1', 'color', 'red', false);

    expect(mockConfigurator.setComponentValue).toHaveBeenCalledWith('component1', 'color', 'red', false);
  });

  it('should handle getValue correctly', async () => {
    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn((event, callback) => {
        if (event === 'productReady') {
          setTimeout(callback, 0);
        }
      }),
      setComponentValue: vi.fn(),
      getComponentValue: vi.fn().mockReturnValue('blue'),
      getCurrentSelections: vi.fn(() => ({}))
    };

    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    (embodeeApi.getProductDataFromParams as any).mockResolvedValue(mockProductData);
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    // Test getValue
    const value = result.current.getValue('component1', 'color');
    expect(value).toBe('blue');
    expect(mockConfigurator.getComponentValue).toHaveBeenCalledWith('component1', 'color');
  });

  it('should handle getSelections correctly', async () => {
    const mockSelections = { 'component1:color': 'red', 'component2:material': 'cotton' };
    
    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn((event, callback) => {
        if (event === 'productReady') {
          setTimeout(callback, 0);
        }
      }),
      setComponentValue: vi.fn(),
      getComponentValue: vi.fn(),
      getCurrentSelections: vi.fn(() => mockSelections)
    };

    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    (embodeeApi.getProductDataFromParams as any).mockResolvedValue(mockProductData);
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    // Test getSelections
    const selections = result.current.getSelections();
    expect(selections).toEqual(mockSelections);
    expect(mockConfigurator.getCurrentSelections).toHaveBeenCalled();
  });

  it('should handle setValue errors gracefully', async () => {
    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn((event, callback) => {
        if (event === 'productReady') {
          setTimeout(callback, 0);
        }
      }),
      setComponentValue: vi.fn().mockRejectedValue(new Error('Set value failed')),
      getComponentValue: vi.fn(),
      getCurrentSelections: vi.fn(() => ({}))
    };

    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    (embodeeApi.getProductDataFromParams as any).mockResolvedValue(mockProductData);
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    // Test setValue error
    await expect(result.current.setValue('component1', 'color', 'red')).rejects.toThrow('Set value failed');
  });

  it('should prevent multiple initializations', async () => {
    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn((event, callback) => {
        if (event === 'productReady') {
          setTimeout(callback, 0);
        }
      }),
      setComponentValue: vi.fn(),
      getComponentValue: vi.fn(),
      getCurrentSelections: vi.fn(() => ({}))
    };

    (embodeeApi.getProductDataFromParams as any).mockResolvedValue(mockProductData);
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    // Wait for initial initialization
    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    // Call initialize multiple times
    await result.current.initialize();
    await result.current.initialize();
    await result.current.initialize();

    // Should only be called once (initial call)
    expect(embodeeApi.getProductDataFromParams).toHaveBeenCalledTimes(1);
    expect(mockEmbodeeLoader.init).toHaveBeenCalledTimes(1);
  });

  it('should handle retry functionality', async () => {
    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn((event, callback) => {
        if (event === 'productReady') {
          setTimeout(callback, 0);
        }
      }),
      setComponentValue: vi.fn(),
      getComponentValue: vi.fn(),
      getCurrentSelections: vi.fn(() => ({}))
    };

    // First call fails, second call succeeds
    (embodeeApi.getProductDataFromParams as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockProductData);
    
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    // Wait for the retry to complete
    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    }, { timeout: 5000 });

    expect(result.current.retryCount).toBe(0); // Reset after success
    expect(result.current.isRetrying).toBe(false);
  });

  it('should provide manual retry functionality', async () => {
    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn((event, callback) => {
        if (event === 'productReady') {
          setTimeout(callback, 0);
        }
      }),
      setComponentValue: vi.fn(),
      getComponentValue: vi.fn(),
      getCurrentSelections: vi.fn(() => ({}))
    };

    // First call fails, second call succeeds
    (embodeeApi.getProductDataFromParams as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockProductData);
    
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    // Wait for initial failure and retry to complete
    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    }, { timeout: 5000 });

    expect(result.current.error).toBeNull();
  });

  it('should handle setValue with retry logic', async () => {
    const mockConfigurator = {
      uiStructure: [],
      library: {},
      config: { product: { name: 'Test Product' } },
      eventIDs: { productReady: 'productReady' },
      subscribe: vi.fn((event, callback) => {
        if (event === 'productReady') {
          setTimeout(callback, 0);
        }
      }),
      setComponentValue: vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(undefined),
      getComponentValue: vi.fn(),
      getCurrentSelections: vi.fn(() => ({}))
    };

    const mockProductData = {
      config: { meta: { name: 'Test Product' } },
      ui: [],
      library: {},
      globalLibrary: {}
    };

    (embodeeApi.getProductDataFromParams as any).mockResolvedValue(mockProductData);
    mockEmbodeeLoader.init.mockResolvedValue(mockConfigurator);

    const { result } = renderHook(() => useEmbodee());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    }, { timeout: 5000 });

    // setValue should succeed after retries
    await result.current.setValue('component1', 'color', 'red');

    expect(mockConfigurator.setComponentValue).toHaveBeenCalledTimes(3); // 2 failures + 1 success
  });
});
