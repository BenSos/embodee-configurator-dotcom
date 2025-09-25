// Enhanced logging utility for Embodee Product Configurator
// Provides structured logging for API calls, responses, and debugging
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
/**
 * Enhanced logger class for structured logging
 */
export class Logger {
    constructor(config = {}) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "logs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // Browser-safe environment check
        const isDevelopment = typeof process !== 'undefined'
            ? process.env['NODE_ENV'] === 'development'
            : window.location.hostname === 'localhost' || window.location.hostname.includes('dev');
        this.config = {
            level: isDevelopment ? LogLevel.DEBUG : LogLevel.WARN,
            enableConsole: true,
            enableStorage: isDevelopment,
            maxStorageEntries: 1000,
            categories: ['API', 'CONFIGURATOR', 'ERROR', 'DEBUG'],
            ...config
        };
    }
    shouldLog(level, category) {
        return (level >= this.config.level &&
            this.config.categories.includes(category));
    }
    createLogEntry(level, category, message, data, context) {
        return {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data,
            ...(context && { context })
        };
    }
    log(level, category, message, data, context) {
        if (!this.shouldLog(level, category))
            return;
        const entry = this.createLogEntry(level, category, message, data, context);
        // Store in memory if enabled
        if (this.config.enableStorage) {
            this.logs.push(entry);
            if (this.logs.length > this.config.maxStorageEntries) {
                this.logs.shift();
            }
        }
        // Console output if enabled
        if (this.config.enableConsole) {
            const levelName = LogLevel[level];
            const prefix = `[${entry.timestamp}] [${levelName}] [${category}]`;
            if (context) {
                console.log(`${prefix} [${context}] ${message}`, data || '');
            }
            else {
                console.log(`${prefix} ${message}`, data || '');
            }
        }
    }
    debug(category, message, data, context) {
        this.log(LogLevel.DEBUG, category, message, data, context);
    }
    info(category, message, data, context) {
        this.log(LogLevel.INFO, category, message, data, context);
    }
    warn(category, message, data, context) {
        this.log(LogLevel.WARN, category, message, data, context);
    }
    error(category, message, data, context) {
        this.log(LogLevel.ERROR, category, message, data, context);
    }
    // API-specific logging methods
    apiCall(method, url, params, context) {
        this.debug('API', `API Call: ${method} ${url}`, { params }, context);
    }
    apiResponse(method, url, status, response, context) {
        const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
        this.log(level, 'API', `API Response: ${method} ${url} (${status})`, { response }, context);
    }
    apiError(method, url, error, context) {
        this.error('API', `API Error: ${method} ${url}`, { error: error.message, stack: error.stack }, context);
    }
    // Configurator-specific logging methods
    configuratorInit(params, context) {
        this.info('CONFIGURATOR', 'Configurator initialization started', { params }, context);
    }
    configuratorReady(options, selections, context) {
        this.info('CONFIGURATOR', 'Configurator ready', { options: options.length, selections: Object.keys(selections).length }, context);
    }
    configuratorError(error, context) {
        this.error('CONFIGURATOR', 'Configurator error', { error: error.message, stack: error.stack }, context);
    }
    // Utility methods
    getLogs(category, level) {
        let filtered = this.logs;
        if (category) {
            filtered = filtered.filter(log => log.category === category);
        }
        if (level !== undefined) {
            filtered = filtered.filter(log => log.level >= level);
        }
        return filtered;
    }
    clearLogs() {
        this.logs = [];
    }
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
// Default logger instance
export const logger = new Logger();
// Convenience functions for backward compatibility
export function logApiError(error, context = 'API Call') {
    logger.error('API', `API Error: ${context}`, { error: error.message, stack: error.stack }, context);
}
export function logApiCall(method, url, params, context) {
    logger.apiCall(method, url, params, context);
}
export function logApiResponse(method, url, status, response, context) {
    logger.apiResponse(method, url, status, response, context);
}
export function logConfiguratorInit(params, context) {
    logger.configuratorInit(params, context);
}
export function logConfiguratorReady(options, selections, context) {
    logger.configuratorReady(options, selections, context);
}
export function logConfiguratorError(error, context) {
    logger.configuratorError(error, context);
}
export default logger;
