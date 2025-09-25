// Enhanced logging utility for Embodee Product Configurator
// Provides structured logging for API calls, responses, and debugging

export enum LogLevel {
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
export class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: process.env['NODE_ENV'] === 'development' ? LogLevel.DEBUG : LogLevel.WARN,
      enableConsole: true,
      enableStorage: process.env['NODE_ENV'] === 'development',
      maxStorageEntries: 1000,
      categories: ['API', 'CONFIGURATOR', 'ERROR', 'DEBUG'],
      ...config
    };
  }

  private shouldLog(level: LogLevel, category: string): boolean {
    return (
      level >= this.config.level &&
      this.config.categories.includes(category)
    );
  }

  private createLogEntry(
    level: LogLevel,
    category: string,
    message: string,
    data?: any,
    context?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      context
    };
  }

  private log(level: LogLevel, category: string, message: string, data?: any, context?: string): void {
    if (!this.shouldLog(level, category)) return;

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
      } else {
        console.log(`${prefix} ${message}`, data || '');
      }
    }
  }

  debug(category: string, message: string, data?: any, context?: string): void {
    this.log(LogLevel.DEBUG, category, message, data, context);
  }

  info(category: string, message: string, data?: any, context?: string): void {
    this.log(LogLevel.INFO, category, message, data, context);
  }

  warn(category: string, message: string, data?: any, context?: string): void {
    this.log(LogLevel.WARN, category, message, data, context);
  }

  error(category: string, message: string, data?: any, context?: string): void {
    this.log(LogLevel.ERROR, category, message, data, context);
  }

  // API-specific logging methods
  apiCall(method: string, url: string, params?: any, context?: string): void {
    this.debug('API', `API Call: ${method} ${url}`, { params }, context);
  }

  apiResponse(method: string, url: string, status: number, response: any, context?: string): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
    this.log(level, 'API', `API Response: ${method} ${url} (${status})`, { response }, context);
  }

  apiError(method: string, url: string, error: any, context?: string): void {
    this.error('API', `API Error: ${method} ${url}`, { error: error.message, stack: error.stack }, context);
  }

  // Configurator-specific logging methods
  configuratorInit(params: any, context?: string): void {
    this.info('CONFIGURATOR', 'Configurator initialization started', { params }, context);
  }

  configuratorReady(options: any, selections: any, context?: string): void {
    this.info('CONFIGURATOR', 'Configurator ready', { options: options.length, selections: Object.keys(selections).length }, context);
  }

  configuratorError(error: any, context?: string): void {
    this.error('CONFIGURATOR', 'Configurator error', { error: error.message, stack: error.stack }, context);
  }

  // Utility methods
  getLogs(category?: string, level?: LogLevel): LogEntry[] {
    let filtered = this.logs;
    
    if (category) {
      filtered = filtered.filter(log => log.category === category);
    }
    
    if (level !== undefined) {
      filtered = filtered.filter(log => log.level >= level);
    }
    
    return filtered;
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Default logger instance
export const logger = new Logger();

// Convenience functions for backward compatibility
export function logApiError(error: any, context: string = 'API Call'): void {
  logger.error('API', `API Error: ${context}`, { error: error.message, stack: error.stack }, context);
}

export function logApiCall(method: string, url: string, params?: any, context?: string): void {
  logger.apiCall(method, url, params, context);
}

export function logApiResponse(method: string, url: string, status: number, response: any, context?: string): void {
  logger.apiResponse(method, url, status, response, context);
}

export function logConfiguratorInit(params: any, context?: string): void {
  logger.configuratorInit(params, context);
}

export function logConfiguratorReady(options: any, selections: any, context?: string): void {
  logger.configuratorReady(options, selections, context);
}

export function logConfiguratorError(error: any, context?: string): void {
  logger.configuratorError(error, context);
}

export default logger;
