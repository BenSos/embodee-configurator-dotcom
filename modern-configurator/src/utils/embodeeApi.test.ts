// Tests for Embodee API service
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmbodeeApiService, embodeeApi, isApiError, getErrorMessage, logApiError, ApiError } from './embodeeApi';
import { URLParams } from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('EmbodeeApiService', () => {
  let apiService: EmbodeeApiService;

  beforeEach(() => {
    apiService = new EmbodeeApiService({
      baseUrl: 'https://test.embodee.com',
      timeout: 5000,
      maxRetries: 2,
      retryDelay: 100
    });
    mockFetch.mockClear();
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getProductData', () => {
    it('should fetch product data successfully', async () => {
      const mockResponse = {
        status: 'ok',
        errorcode: 0,
        message: 'success',
        result: {
          config: { meta: { name: 'Test Product' } },
          ui: [],
          library: {},
          globalLibrary: {}
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.getProductData('workspace123', 'product456');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.embodee.com/configurator/get-data/workspace123/product456/Master/false',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockResponse.result);
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = {
        status: 'error',
        errorcode: 404,
        message: 'Product not found',
        result: null
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockErrorResponse)
      });

      await expect(apiService.getProductData('workspace123', 'invalid-product'))
        .rejects.toThrow('API Error: Product not found');
    });

    it('should retry on network errors', async () => {
      const mockResponse = {
        status: 'ok',
        errorcode: 0,
        message: 'success',
        result: { config: { meta: { name: 'Test Product' } }, ui: [], library: {}, globalLibrary: {} }
      };

      // First call fails, second succeeds
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });

      const result = await apiService.getProductData('workspace123', 'product456');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponse.result);
    });

    it('should fail after max retries', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(apiService.getProductData('workspace123', 'product456'))
        .rejects.toThrow();
      
      expect(mockFetch).toHaveBeenCalledTimes(2); // maxRetries
    });

    it('should handle custom variant and designID', async () => {
      const mockResponse = {
        status: 'ok',
        errorcode: 0,
        message: 'success',
        result: { config: { meta: { name: 'Test Product' } }, ui: [], library: {}, globalLibrary: {} }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await apiService.getProductData('workspace123', 'product456', 'Red', 'design123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.embodee.com/configurator/get-data/workspace123/product456/Red/design123',
        expect.any(Object)
      );
    });
  });

  describe('getProductDataFromParams', () => {
    it('should fetch product data using URL parameters', async () => {
      const mockResponse = {
        status: 'ok',
        errorcode: 0,
        message: 'success',
        result: { config: { meta: { name: 'Test Product' } }, ui: [], library: {}, globalLibrary: {} }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const params: URLParams = {
        workspaceID: 'workspace123',
        productID: 'product456',
        variant: 'Blue',
        designID: 'design789'
      };

      const result = await apiService.getProductDataFromParams(params);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.embodee.com/configurator/get-data/workspace123/product456/Blue/design789',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.result);
    });
  });

  describe('getLibraryData', () => {
    it('should fetch library data successfully', async () => {
      const mockResponse = {
        status: 'ok',
        errorcode: 0,
        message: 'success',
        result: { colors: {}, materials: {} }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.getLibraryData('workspace123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.embodee.com/configurator/get-library/workspace123',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.result);
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      apiService.updateConfig({ timeout: 10000, maxRetries: 5 });
      
      const config = apiService.getConfig();
      expect(config.timeout).toBe(10000);
      expect(config.maxRetries).toBe(5);
    });

    it('should use default configuration', () => {
      const defaultService = new EmbodeeApiService();
      const config = defaultService.getConfig();
      
      expect(config.baseUrl).toBe('https://embodee.app');
      expect(config.timeout).toBe(30000);
      expect(config.maxRetries).toBe(3);
    });
  });

  describe('timeout handling', () => {
    it('should handle timeout configuration', () => {
      // Test that timeout configuration is properly set
      const fastApiService = new EmbodeeApiService({
        timeout: 1000,
        maxRetries: 1
      });
      
      const config = fastApiService.getConfig();
      expect(config.timeout).toBe(1000);
    });
  });
});

describe('Utility Functions', () => {
  describe('isApiError', () => {
    it('should identify API errors', () => {
      const apiError = new ApiError('API Error', 404, 404, {});
      const regularError = new Error('Regular Error');

      expect(isApiError(apiError)).toBe(true);
      expect(isApiError(regularError)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error', () => {
      const error = new Error('Test error');
      expect(getErrorMessage(error)).toBe('Test error');
    });

    it('should handle unknown error types', () => {
      expect(getErrorMessage('string error')).toBe('An unknown error occurred');
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
    });
  });

  describe('logApiError', () => {
    it('should be a function', () => {
      expect(typeof logApiError).toBe('function');
    });

    it('should handle different error types', () => {
      const error = new Error('Test error');
      // Just test that it doesn't throw
      expect(() => logApiError(error, 'Test Context')).not.toThrow();
    });
  });
});

describe('Default API Service', () => {
  it('should be an instance of EmbodeeApiService', () => {
    expect(embodeeApi).toBeInstanceOf(EmbodeeApiService);
  });

  it('should use default configuration', () => {
    const config = embodeeApi.getConfig();
    expect(config.baseUrl).toBe('https://embodee.app');
  });
});
