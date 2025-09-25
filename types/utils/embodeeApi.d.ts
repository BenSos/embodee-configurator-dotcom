import { URLParams, EmbodeeProductData } from '../types';
/**
 * Custom API error class for better error handling
 */
export declare class ApiError extends Error {
    readonly code: number;
    readonly status: number;
    readonly response?: any;
    constructor(message: string, code?: number, status?: number, response?: any);
}
/**
 * Configuration for API service
 */
interface ApiConfig {
    baseUrl: string;
    timeout: number;
    maxRetries: number;
    retryDelay: number;
}
/**
 * API service class for Embodee integration
 */
export declare class EmbodeeApiService {
    private config;
    constructor(config?: Partial<ApiConfig>);
    /**
     * Fetches product data from Embodee API
     * @param workspaceID - The workspace identifier
     * @param productID - The product identifier
     * @param variant - Optional variant name (defaults to 'Master')
     * @param designID - Optional design ID (defaults to 'false')
     * @returns Promise resolving to product data
     */
    getProductData(workspaceID: string, productID: string, variant?: string, designID?: string): Promise<EmbodeeProductData>;
    /**
     * Fetches product data using URL parameters
     * @param params - URL parameters containing workspaceID, productID, etc.
     * @returns Promise resolving to product data
     */
    getProductDataFromParams(params: URLParams): Promise<EmbodeeProductData>;
    /**
     * Fetches library data for a workspace
     * @param workspaceID - The workspace identifier
     * @returns Promise resolving to library data
     */
    getLibraryData(workspaceID: string): Promise<any>;
    /**
     * Builds the product data URL
     * @param workspaceID - The workspace identifier
     * @param productID - The product identifier
     * @param variant - The variant name
     * @param designID - The design ID
     * @returns Complete URL for product data endpoint
     */
    private buildProductDataUrl;
    /**
     * Fetches data with retry logic and timeout
     * @param url - URL to fetch
     * @param options - Fetch options
     * @returns Promise resolving to Response
     */
    private fetchWithRetry;
    /**
     * Delays execution for the specified number of milliseconds
     * @param ms - Milliseconds to delay
     * @returns Promise that resolves after the delay
     */
    private delay;
    /**
     * Validates API response structure
     * @param data - Response data to validate
     * @returns True if valid, false otherwise
     */
    /**
     * Updates API configuration
     * @param newConfig - Partial configuration to update
     */
    updateConfig(newConfig: Partial<ApiConfig>): void;
    /**
     * Gets current API configuration
     * @returns Current configuration
     */
    getConfig(): ApiConfig;
}
/**
 * Default API service instance
 */
export declare const embodeeApi: EmbodeeApiService;
/**
 * Creates a new API service instance with custom configuration
 * @param config - Custom configuration
 * @returns New API service instance
 */
export declare function createEmbodeeApiService(config: Partial<ApiConfig>): EmbodeeApiService;
/**
 * Utility function to check if an error is an API error
 * @param error - Error to check
 * @returns True if it's an API error
 */
export declare function isApiError(error: any): error is ApiError;
/**
 * Utility function to get error message from any error type
 * @param error - Error to extract message from
 * @returns Error message string
 */
export declare function getErrorMessage(error: any): string;
/**
 * Utility function to log API errors with context
 * @param error - Error to log
 * @param context - Additional context information
 */
export declare function logApiError(error: any, context?: string): void;
export {};
//# sourceMappingURL=embodeeApi.d.ts.map