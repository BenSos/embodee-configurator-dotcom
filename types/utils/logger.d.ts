export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    category: string;
    message: string;
    data?: any;
    context?: string;
}
export interface LoggerConfig {
    level: LogLevel;
    enableConsole: boolean;
    enableStorage: boolean;
    maxStorageEntries: number;
    categories: string[];
}
/**
 * Enhanced logger class for structured logging
 */
export declare class Logger {
    private config;
    private logs;
    constructor(config?: Partial<LoggerConfig>);
    private shouldLog;
    private createLogEntry;
    private log;
    debug(category: string, message: string, data?: any, context?: string): void;
    info(category: string, message: string, data?: any, context?: string): void;
    warn(category: string, message: string, data?: any, context?: string): void;
    error(category: string, message: string, data?: any, context?: string): void;
    apiCall(method: string, url: string, params?: any, context?: string): void;
    apiResponse(method: string, url: string, status: number, response: any, context?: string): void;
    apiError(method: string, url: string, error: any, context?: string): void;
    configuratorInit(params: any, context?: string): void;
    configuratorReady(options: any, selections: any, context?: string): void;
    configuratorError(error: any, context?: string): void;
    getLogs(category?: string, level?: LogLevel): LogEntry[];
    clearLogs(): void;
    exportLogs(): string;
    updateConfig(newConfig: Partial<LoggerConfig>): void;
}
export declare const logger: Logger;
export declare function logApiError(error: any, context?: string): void;
export declare function logApiCall(method: string, url: string, params?: any, context?: string): void;
export declare function logApiResponse(method: string, url: string, status: number, response: any, context?: string): void;
export declare function logConfiguratorInit(params: any, context?: string): void;
export declare function logConfiguratorReady(options: any, selections: any, context?: string): void;
export declare function logConfiguratorError(error: any, context?: string): void;
export default logger;
//# sourceMappingURL=logger.d.ts.map