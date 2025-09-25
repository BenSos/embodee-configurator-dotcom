// Embodee API service for fetching product data and configuration
// Handles API calls to Embodee endpoints with error handling and retry logic
import { logger, logApiCall, logApiResponse } from './logger';
/**
 * Custom API error class for better error handling
 */
export class ApiError extends Error {
    constructor(message, code = 0, status = 0, response) {
        super(message);
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "response", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.response = response;
    }
}
/**
 * Default API configuration
 */
const DEFAULT_API_CONFIG = {
    baseUrl: 'https://embodee.app',
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 1000, // 1 second
};
/**
 * API service class for Embodee integration
 */
export class EmbodeeApiService {
    constructor(config = {}) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = { ...DEFAULT_API_CONFIG, ...config };
    }
    /**
     * Fetches product data from Embodee API
     * @param workspaceID - The workspace identifier
     * @param productID - The product identifier
     * @param variant - Optional variant name (defaults to 'Master')
     * @param designID - Optional design ID (defaults to 'false')
     * @returns Promise resolving to product data
     */
    async getProductData(workspaceID, productID, variant = 'Master', designID = 'false') {
        const url = this.buildProductDataUrl(workspaceID, productID, variant, designID);
        // Log API call
        logApiCall('GET', url, { workspaceID, productID, variant, designID }, 'getProductData');
        try {
            const response = await this.fetchWithRetry(url);
            const data = await response.json();
            // Log API response
            logApiResponse('GET', url, response.status, data, 'getProductData');
            if (data.status !== 'ok') {
                const apiError = new ApiError(`API Error: ${data.message}`, data.errorcode, response.status, data);
                logger.error('API', 'getProductData error', { error: apiError.message }, 'getProductData');
                throw apiError;
            }
            logger.info('API', 'Product data fetched successfully', {
                workspaceID,
                productID,
                variant,
                designID,
                hasConfig: !!data.result?.config,
                hasUI: !!data.result?.ui,
                hasLibrary: !!data.result?.library
            }, 'getProductData');
            return data.result;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            const apiError = new ApiError(`Failed to fetch product data: ${error instanceof Error ? error.message : 'Unknown error'}`, 0, 0, error);
            logger.error('API', 'getProductData error', { error: apiError.message }, 'getProductData');
            throw apiError;
        }
    }
    /**
     * Fetches product data using URL parameters
     * @param params - URL parameters containing workspaceID, productID, etc.
     * @returns Promise resolving to product data
     */
    async getProductDataFromParams(params) {
        const { workspaceID, productID, variant = 'Master', designID = 'false' } = params;
        return this.getProductData(workspaceID, productID, variant, designID);
    }
    /**
     * Fetches library data for a workspace
     * @param workspaceID - The workspace identifier
     * @returns Promise resolving to library data
     */
    async getLibraryData(workspaceID) {
        const url = `${this.config.baseUrl}/configurator/get-library/${workspaceID}`;
        try {
            const response = await this.fetchWithRetry(url);
            const data = await response.json();
            if (data.status !== 'ok') {
                throw new ApiError(`API Error: ${data.message}`, data.errorcode, response.status, data);
            }
            return data.result;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(`Failed to fetch library data: ${error instanceof Error ? error.message : 'Unknown error'}`, 0, 0, error);
        }
    }
    /**
     * Builds the product data URL
     * @param workspaceID - The workspace identifier
     * @param productID - The product identifier
     * @param variant - The variant name
     * @param designID - The design ID
     * @returns Complete URL for product data endpoint
     */
    buildProductDataUrl(workspaceID, productID, variant, designID) {
        return `${this.config.baseUrl}/configurator/get-data/${workspaceID}/${productID}/${variant}/${designID}`;
    }
    /**
     * Fetches data with retry logic and timeout
     * @param url - URL to fetch
     * @param options - Fetch options
     * @returns Promise resolving to Response
     */
    async fetchWithRetry(url, options = {}) {
        let lastError = null;
        logger.debug('API', `Starting fetch with retry for ${url}`, {
            maxRetries: this.config.maxRetries,
            timeout: this.config.timeout
        }, 'fetchWithRetry');
        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                logger.debug('API', `Fetch attempt ${attempt}/${this.config.maxRetries}`, { url }, 'fetchWithRetry');
                const controller = new AbortController();
                const timeoutId = setTimeout(() => {
                    logger.warn('API', `Request timeout after ${this.config.timeout}ms`, { url }, 'fetchWithRetry');
                    controller.abort();
                }, this.config.timeout);
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...options.headers,
                    },
                });
                clearTimeout(timeoutId);
                logger.debug('API', `Response received`, {
                    url,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries())
                }, 'fetchWithRetry');
                if (!response.ok) {
                    const apiError = new ApiError(`HTTP ${response.status}: ${response.statusText}`, 0, response.status, response);
                    logger.warn('API', `HTTP error response`, {
                        url,
                        status: response.status,
                        statusText: response.statusText
                    }, 'fetchWithRetry');
                    throw apiError;
                }
                logger.info('API', `Request successful`, { url, status: response.status }, 'fetchWithRetry');
                return response;
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');
                logger.warn('API', `Request failed (attempt ${attempt}/${this.config.maxRetries})`, {
                    url,
                    error: lastError.message,
                    errorType: error.constructor?.name || 'Unknown'
                }, 'fetchWithRetry');
                // Don't retry on certain errors
                if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                    logger.error('API', `Client error - not retrying`, {
                        url,
                        status: error.status,
                        message: error.message
                    }, 'fetchWithRetry');
                    throw error;
                }
                // Log retry attempt
                if (attempt < this.config.maxRetries) {
                    const delay = this.config.retryDelay * attempt;
                    logger.info('API', `Retrying in ${delay}ms`, {
                        url,
                        attempt,
                        maxRetries: this.config.maxRetries,
                        delay
                    }, 'fetchWithRetry');
                    await this.delay(delay);
                }
            }
        }
        logger.error('API', `Max retries exceeded`, {
            url,
            maxRetries: this.config.maxRetries,
            lastError: lastError?.message
        }, 'fetchWithRetry');
        throw lastError || new Error('Max retries exceeded');
    }
    /**
     * Delays execution for the specified number of milliseconds
     * @param ms - Milliseconds to delay
     * @returns Promise that resolves after the delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Validates API response structure
     * @param data - Response data to validate
     * @returns True if valid, false otherwise
     */
    // private _isValidApiResponse(data: any): data is EmbodeeApiResponse<any> {
    //   return (
    //     data &&
    //     typeof data === 'object' &&
    //     typeof data.status === 'string' &&
    //     typeof data.errorcode === 'number' &&
    //     typeof data.message === 'string' &&
    //     'result' in data
    //   );
    // }
    /**
     * Updates API configuration
     * @param newConfig - Partial configuration to update
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    /**
     * Gets current API configuration
     * @returns Current configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
/**
 * Default API service instance
 */
export const embodeeApi = new EmbodeeApiService();
/**
 * Creates a new API service instance with custom configuration
 * @param config - Custom configuration
 * @returns New API service instance
 */
export function createEmbodeeApiService(config) {
    return new EmbodeeApiService(config);
}
/**
 * Utility function to check if an error is an API error
 * @param error - Error to check
 * @returns True if it's an API error
 */
export function isApiError(error) {
    return error instanceof ApiError;
}
/**
 * Utility function to get error message from any error type
 * @param error - Error to extract message from
 * @returns Error message string
 */
export function getErrorMessage(error) {
    if (error instanceof ApiError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unknown error occurred';
}
/**
 * Utility function to log API errors with context
 * @param error - Error to log
 * @param context - Additional context information
 */
export function logApiError(error, context = 'API Call') {
    if (process.env['NODE_ENV'] === 'development') {
        console.error(`[${context}]`, error);
        if (error instanceof ApiError) {
            console.error('API Error Details:', {
                message: error.message,
                code: error.code,
                status: error.status,
                response: error.response
            });
        }
    }
}
