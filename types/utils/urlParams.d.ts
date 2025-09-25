import { URLParams } from '../types';
/**
 * Parses URL parameters from the current window location or a provided URL
 * @param url - Optional URL string to parse. If not provided, uses current window.location
 * @returns URLParams object with parsed parameters
 */
export declare function parseUrlParams(url?: string): URLParams;
/**
 * Parses URL parameters from a query string
 * @param queryString - The query string to parse (e.g., "?workspaceID=123&productID=456")
 * @returns URLParams object with parsed parameters
 */
export declare function parseQueryString(queryString: string): URLParams;
/**
 * Validates that required URL parameters are present and valid
 * @param params - URLParams object to validate
 * @returns Object with validation result and error message if invalid
 */
export declare function validateUrlParams(params: URLParams): {
    isValid: boolean;
    error?: string;
};
/**
 * Creates a URL with the provided parameters
 * @param baseUrl - Base URL to append parameters to
 * @param params - URLParams object to convert to query string
 * @returns Complete URL with parameters
 */
export declare function buildUrlWithParams(baseUrl: string, params: URLParams): string;
/**
 * Gets URL parameters with fallback to defaults and validation
 * @param url - Optional URL to parse. If not provided, uses current window.location
 * @returns Validated URLParams object or throws error if validation fails
 */
export declare function getValidatedUrlParams(url?: string): URLParams;
/**
 * Checks if the current URL contains configurator parameters
 * @returns True if configurator parameters are present in the URL
 */
export declare function hasConfiguratorParams(): boolean;
/**
 * Logs URL parameters for debugging purposes
 * @param params - URLParams object to log
 * @param label - Optional label for the log message
 */
export declare function logUrlParams(params: URLParams, label?: string): void;
//# sourceMappingURL=urlParams.d.ts.map