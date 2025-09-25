// URL parameter parsing utility for Embodee Product Configurator
// Handles parsing of workspaceID, productID, variant, designID and other parameters
import { applyFallbacksToParams } from './fallbackConfig';
import { logger } from './logger';
/**
 * Default values for URL parameters when not provided
 */
const DEFAULT_PARAMS = {
    workspaceID: 'default-workspace',
    productID: 'default-product',
    host: 'https://embodee.com',
    width: '100%',
    height: '600px'
};
/**
 * Parses URL parameters from the current window location or a provided URL
 * @param url - Optional URL string to parse. If not provided, uses current window.location
 * @returns URLParams object with parsed parameters
 */
export function parseUrlParams(url) {
    const urlToParse = url || (typeof window !== 'undefined' ? window.location.href : '');
    const urlObj = new URL(urlToParse);
    const params = urlObj.searchParams;
    logger.debug('URL_PARAMS', 'Parsing URL parameters', { url: urlToParse }, 'parseUrlParams');
    // Parse required parameters - check if they exist in URL first
    const hasWorkspaceID = params.has('workspaceID') || params.has('workspace');
    const hasProductID = params.has('productID') || params.has('product');
    const workspaceID = params.get('workspaceID') || params.get('workspace');
    const productID = params.get('productID') || params.get('product');
    // Parse optional parameters
    const variant = params.get('variant') || undefined;
    const designID = params.get('designID') || params.get('design') || undefined;
    const host = params.get('host') || undefined;
    const width = params.get('width') || undefined;
    const height = params.get('height') || undefined;
    // Build partial params object
    const partialParams = {};
    if (workspaceID)
        partialParams.workspaceID = workspaceID;
    if (productID)
        partialParams.productID = productID;
    if (variant)
        partialParams.variant = variant;
    if (designID)
        partialParams.designID = designID;
    if (host)
        partialParams.host = host;
    if (width)
        partialParams.width = width;
    if (height)
        partialParams.height = height;
    // Apply fallbacks for missing parameters
    const result = applyFallbacksToParams(partialParams);
    logger.info('URL_PARAMS', 'URL parameters parsed successfully', {
        hasWorkspaceID,
        hasProductID,
        parsedParams: partialParams,
        finalParams: result,
        fallbacksUsed: {
            workspaceID: !hasWorkspaceID,
            productID: !hasProductID,
            host: !host,
            width: !width,
            height: !height
        }
    }, 'parseUrlParams');
    return result;
}
/**
 * Parses URL parameters from a query string
 * @param queryString - The query string to parse (e.g., "?workspaceID=123&productID=456")
 * @returns URLParams object with parsed parameters
 */
export function parseQueryString(queryString) {
    // Remove leading ? if present
    const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    // Create a temporary URL to use URLSearchParams
    const tempUrl = `https://example.com?${cleanQuery}`;
    return parseUrlParams(tempUrl);
}
/**
 * Validates that required URL parameters are present and valid
 * @param params - URLParams object to validate
 * @returns Object with validation result and error message if invalid
 */
export function validateUrlParams(params) {
    if (!params.workspaceID || params.workspaceID.trim() === '') {
        return { isValid: false, error: 'workspaceID is required' };
    }
    if (!params.productID || params.productID.trim() === '') {
        return { isValid: false, error: 'productID is required' };
    }
    // Validate workspaceID format (should be alphanumeric with possible hyphens/underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(params.workspaceID)) {
        return { isValid: false, error: 'workspaceID contains invalid characters' };
    }
    // Validate productID format (should be alphanumeric with possible hyphens/underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(params.productID)) {
        return { isValid: false, error: 'productID contains invalid characters' };
    }
    // Validate variant if provided
    if (params.variant && !/^[a-zA-Z0-9_-]+$/.test(params.variant)) {
        return { isValid: false, error: 'variant contains invalid characters' };
    }
    // Validate designID if provided
    if (params.designID && !/^[a-zA-Z0-9_-]+$/.test(params.designID)) {
        return { isValid: false, error: 'designID contains invalid characters' };
    }
    return { isValid: true };
}
/**
 * Creates a URL with the provided parameters
 * @param baseUrl - Base URL to append parameters to
 * @param params - URLParams object to convert to query string
 * @returns Complete URL with parameters
 */
export function buildUrlWithParams(baseUrl, params) {
    const url = new URL(baseUrl);
    // Add required parameters
    url.searchParams.set('workspaceID', params.workspaceID);
    url.searchParams.set('productID', params.productID);
    // Add optional parameters if they exist
    if (params.variant) {
        url.searchParams.set('variant', params.variant);
    }
    if (params.designID) {
        url.searchParams.set('designID', params.designID);
    }
    if (params.host) {
        url.searchParams.set('host', params.host);
    }
    if (params.width && params.width !== DEFAULT_PARAMS.width) {
        url.searchParams.set('width', params.width);
    }
    if (params.height) {
        url.searchParams.set('height', params.height);
    }
    return url.toString();
}
/**
 * Gets URL parameters with fallback to defaults and validation
 * @param url - Optional URL to parse. If not provided, uses current window.location
 * @returns Validated URLParams object or throws error if validation fails
 */
export function getValidatedUrlParams(url) {
    const params = parseUrlParams(url);
    const validation = validateUrlParams(params);
    if (!validation.isValid) {
        throw new Error(`Invalid URL parameters: ${validation.error}`);
    }
    return params;
}
/**
 * Checks if the current URL contains configurator parameters
 * @returns True if configurator parameters are present in the URL
 */
export function hasConfiguratorParams() {
    if (typeof window === 'undefined') {
        return false;
    }
    const params = new URLSearchParams(window.location.search);
    return params.has('workspaceID') || params.has('workspace') ||
        params.has('productID') || params.has('product');
}
/**
 * Logs URL parameters for debugging purposes
 * @param params - URLParams object to log
 * @param label - Optional label for the log message
 */
export function logUrlParams(params, label = 'URL Parameters') {
    if (process.env['NODE_ENV'] === 'development') {
        console.log(`${label}:`, {
            workspaceID: params.workspaceID,
            productID: params.productID,
            variant: params.variant || 'none',
            designID: params.designID || 'none',
            host: params.host,
            width: params.width,
            height: params.height
        });
    }
}
