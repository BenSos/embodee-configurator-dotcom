// Utility functions exports
// This file will be used to export all utility functions for easy importing

export {
  parseUrlParams,
  parseQueryString,
  validateUrlParams,
  buildUrlWithParams,
  getValidatedUrlParams,
  hasConfiguratorParams,
  logUrlParams
} from './urlParams';

export {
  EmbodeeApiService,
  embodeeApi,
  createEmbodeeApiService,
  isApiError,
  getErrorMessage,
  logApiError
} from './embodeeApi';

export {
  Logger,
  LogLevel,
  logger,
  logApiCall,
  logApiResponse,
  logConfiguratorInit,
  logConfiguratorReady,
  logConfiguratorError
} from './logger';

export {
  FallbackConfigManager,
  fallbackManager,
  getFallbackConfig,
  updateFallbackConfig,
  applyFallbacksToParams,
  validateFallbackConfig,
  getFallbackSummary
} from './fallbackConfig';
