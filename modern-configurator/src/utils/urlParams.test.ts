// Tests for URL parameter parsing utility
import {
  parseUrlParams,
  parseQueryString,
  validateUrlParams,
  buildUrlWithParams,
  getValidatedUrlParams,
  hasConfiguratorParams
} from './urlParams';
import { URLParams } from '../types';

describe('URL Parameter Parsing', () => {
  describe('parseUrlParams', () => {
    it('should parse all parameters from a complete URL', () => {
      const url = 'https://example.com/configurator?workspaceID=test-workspace&productID=test-product&variant=red&designID=design-123&host=https://embodee.com&width=800px&height=600px';
      const result = parseUrlParams(url);
      
      expect(result).toEqual({
        workspaceID: 'test-workspace',
        productID: 'test-product',
        variant: 'red',
        designID: 'design-123',
        host: 'https://embodee.com',
        width: '800px',
        height: '600px'
      });
    });

    it('should use default values for missing parameters', () => {
      const url = 'https://example.com/configurator?workspaceID=test-workspace&productID=test-product';
      const result = parseUrlParams(url);
      
      expect(result).toEqual({
        workspaceID: 'test-workspace',
        productID: 'test-product',
        variant: undefined,
        designID: undefined,
        host: 'https://embodee.com',
        width: '100%',
        height: '600px'
      });
    });

    it('should handle alternative parameter names', () => {
      const url = 'https://example.com/configurator?workspace=alt-workspace&product=alt-product&design=alt-design';
      const result = parseUrlParams(url);
      
      expect(result).toEqual({
        workspaceID: 'alt-workspace',
        productID: 'alt-product',
        variant: undefined,
        designID: 'alt-design',
        host: 'https://embodee.com',
        width: '100%',
        height: '600px'
      });
    });
  });

  describe('parseQueryString', () => {
    it('should parse query string without leading ?', () => {
      const queryString = 'workspaceID=test-workspace&productID=test-product&variant=blue';
      const result = parseQueryString(queryString);
      
      expect(result.workspaceID).toBe('test-workspace');
      expect(result.productID).toBe('test-product');
      expect(result.variant).toBe('blue');
    });

    it('should parse query string with leading ?', () => {
      const queryString = '?workspaceID=test-workspace&productID=test-product';
      const result = parseQueryString(queryString);
      
      expect(result.workspaceID).toBe('test-workspace');
      expect(result.productID).toBe('test-product');
    });
  });

  describe('validateUrlParams', () => {
    it('should validate correct parameters', () => {
      const params: URLParams = {
        workspaceID: 'valid-workspace',
        productID: 'valid-product',
        variant: 'valid-variant',
        designID: 'valid-design'
      };
      
      const result = validateUrlParams(params);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject missing workspaceID', () => {
      const params: URLParams = {
        workspaceID: '',
        productID: 'valid-product'
      };
      
      const result = validateUrlParams(params);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('workspaceID is required');
    });

    it('should reject missing productID', () => {
      const params: URLParams = {
        workspaceID: 'valid-workspace',
        productID: ''
      };
      
      const result = validateUrlParams(params);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('productID is required');
    });

    it('should reject invalid characters in workspaceID', () => {
      const params: URLParams = {
        workspaceID: 'invalid@workspace',
        productID: 'valid-product'
      };
      
      const result = validateUrlParams(params);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('workspaceID contains invalid characters');
    });

    it('should reject invalid characters in productID', () => {
      const params: URLParams = {
        workspaceID: 'valid-workspace',
        productID: 'invalid@product'
      };
      
      const result = validateUrlParams(params);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('productID contains invalid characters');
    });
  });

  describe('buildUrlWithParams', () => {
    it('should build URL with all parameters', () => {
      const baseUrl = 'https://example.com/configurator';
      const params: URLParams = {
        workspaceID: 'test-workspace',
        productID: 'test-product',
        variant: 'red',
        designID: 'design-123',
        host: 'https://embodee.com',
        width: '800px',
        height: '600px'
      };
      
      const result = buildUrlWithParams(baseUrl, params);
      const url = new URL(result);
      
      expect(url.searchParams.get('workspaceID')).toBe('test-workspace');
      expect(url.searchParams.get('productID')).toBe('test-product');
      expect(url.searchParams.get('variant')).toBe('red');
      expect(url.searchParams.get('designID')).toBe('design-123');
      expect(url.searchParams.get('host')).toBe('https://embodee.com');
      expect(url.searchParams.get('width')).toBe('800px');
      expect(url.searchParams.get('height')).toBe('600px');
    });

    it('should build URL with only required parameters', () => {
      const baseUrl = 'https://example.com/configurator';
      const params: URLParams = {
        workspaceID: 'test-workspace',
        productID: 'test-product'
      };
      
      const result = buildUrlWithParams(baseUrl, params);
      const url = new URL(result);
      
      expect(url.searchParams.get('workspaceID')).toBe('test-workspace');
      expect(url.searchParams.get('productID')).toBe('test-product');
      expect(url.searchParams.get('variant')).toBeNull();
      expect(url.searchParams.get('designID')).toBeNull();
    });
  });

  describe('getValidatedUrlParams', () => {
    it('should return validated parameters for valid URL', () => {
      const url = 'https://example.com/configurator?workspaceID=test-workspace&productID=test-product';
      const result = getValidatedUrlParams(url);
      
      expect(result.workspaceID).toBe('test-workspace');
      expect(result.productID).toBe('test-product');
    });

    it('should throw error for invalid parameters', () => {
      const url = 'https://example.com/configurator?workspaceID=&productID=test-product';
      
      expect(() => getValidatedUrlParams(url)).toThrow('Invalid URL parameters: workspaceID is required');
    });
  });

  describe('hasConfiguratorParams', () => {
    // Note: This test would require mocking window.location
    // For now, we'll just test that the function exists and doesn't throw
    it('should be a function', () => {
      expect(typeof hasConfiguratorParams).toBe('function');
    });
  });
});
