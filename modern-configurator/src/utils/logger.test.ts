import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger, LogLevel, logger } from './logger';

describe('Logger', () => {
  let mockConsole: any;

  beforeEach(() => {
    mockConsole = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn()
    };
    
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(mockConsole.log);
    vi.spyOn(console, 'error').mockImplementation(mockConsole.error);
    vi.spyOn(console, 'warn').mockImplementation(mockConsole.warn);
    vi.spyOn(console, 'info').mockImplementation(mockConsole.info);
  });

  it('should create logger with default config', () => {
    const testLogger = new Logger();
    expect(testLogger).toBeDefined();
  });

  it('should create logger with custom config', () => {
    const testLogger = new Logger({
      level: LogLevel.ERROR,
      enableConsole: false,
      enableStorage: true,
      maxStorageEntries: 100,
      categories: ['TEST']
    });
    expect(testLogger).toBeDefined();
  });

  it('should log debug messages in development', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: true,
      categories: ['TEST']
    });

    testLogger.debug('TEST', 'Debug message', { data: 'test' });
    
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining('[DEBUG] [TEST] Debug message'),
      { data: 'test' }
    );
  });

  it('should not log debug messages when level is too high', () => {
    const testLogger = new Logger({
      level: LogLevel.ERROR,
      enableConsole: true,
      categories: ['TEST']
    });

    testLogger.debug('TEST', 'Debug message');
    
    expect(mockConsole.log).not.toHaveBeenCalled();
  });

  it('should not log messages for disabled categories', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: true,
      categories: ['TEST']
    });

    testLogger.debug('DISABLED', 'Debug message');
    
    expect(mockConsole.log).not.toHaveBeenCalled();
  });

  it('should store logs when storage is enabled', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: false,
      enableStorage: true,
      categories: ['TEST']
    });

    testLogger.debug('TEST', 'Debug message', { data: 'test' });
    
    const logs = testLogger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Debug message');
    expect(logs[0].data).toEqual({ data: 'test' });
  });

  it('should limit stored logs to maxStorageEntries', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: false,
      enableStorage: true,
      maxStorageEntries: 2,
      categories: ['TEST']
    });

    testLogger.debug('TEST', 'Message 1');
    testLogger.debug('TEST', 'Message 2');
    testLogger.debug('TEST', 'Message 3');
    
    const logs = testLogger.getLogs();
    expect(logs).toHaveLength(2);
    expect(logs[0].message).toBe('Message 2');
    expect(logs[1].message).toBe('Message 3');
  });

  it('should filter logs by category', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: false,
      enableStorage: true,
      categories: ['TEST', 'OTHER']
    });

    testLogger.debug('TEST', 'Test message');
    testLogger.debug('OTHER', 'Other message');
    testLogger.debug('IGNORED', 'Ignored message');
    
    const testLogs = testLogger.getLogs('TEST');
    expect(testLogs).toHaveLength(1);
    expect(testLogs[0].message).toBe('Test message');
  });

  it('should filter logs by level', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: false,
      enableStorage: true,
      categories: ['TEST']
    });

    testLogger.debug('TEST', 'Debug message');
    testLogger.info('TEST', 'Info message');
    testLogger.warn('TEST', 'Warn message');
    testLogger.error('TEST', 'Error message');
    
    const errorLogs = testLogger.getLogs('TEST', LogLevel.ERROR);
    expect(errorLogs).toHaveLength(1);
    expect(errorLogs[0].message).toBe('Error message');
  });

  it('should export logs as JSON', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: false,
      enableStorage: true,
      categories: ['TEST']
    });

    testLogger.debug('TEST', 'Debug message', { data: 'test' });
    
    const exported = testLogger.exportLogs();
    const parsed = JSON.parse(exported);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].message).toBe('Debug message');
  });

  it('should clear logs', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: false,
      enableStorage: true,
      categories: ['TEST']
    });

    testLogger.debug('TEST', 'Debug message');
    expect(testLogger.getLogs()).toHaveLength(1);
    
    testLogger.clearLogs();
    expect(testLogger.getLogs()).toHaveLength(0);
  });

  it('should log API calls', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: true,
      categories: ['API']
    });

    testLogger.apiCall('GET', 'https://api.example.com', { param: 'value' }, 'test');
    
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining('[DEBUG] [API] [test] API Call: GET https://api.example.com'),
      { params: { param: 'value' } }
    );
  });

  it('should log API responses', () => {
    const testLogger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: true,
      categories: ['API']
    });

    testLogger.apiResponse('GET', 'https://api.example.com', 200, { data: 'response' }, 'test');
    
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining('[DEBUG] [API] [test] API Response: GET https://api.example.com (200)'),
      { response: { data: 'response' } }
    );
  });

  it('should log API errors', () => {
    const testLogger = new Logger({
      level: LogLevel.ERROR,
      enableConsole: true,
      categories: ['API']
    });

    const error = new Error('API Error');
    testLogger.apiError('GET', 'https://api.example.com', error, 'test');
    
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR] [API] [test] API Error: GET https://api.example.com'),
      { error: 'API Error', stack: expect.any(String) }
    );
  });
});
