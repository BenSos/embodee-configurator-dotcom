// Custom hook for Embodee API integration and state management
// Provides React state management for the product configurator

import { useState, useEffect, useCallback, useRef } from 'react';
import { embodeeApi, getValidatedUrlParams, logApiError } from '../utils';
import { logger, logConfiguratorInit, logConfiguratorReady, logConfiguratorError } from '../utils/logger';
import { 
  EmbodeeProductData, 
  EmbodeeConfigurator, 
  ConfiguratorDisplayOption, 
  Selections, 
  UseEmbodeeReturn,
  URLParams
} from '../types';

/**
 * Helper to parse the UI structure from the Embodee API into a format the UI components can use
 * This function transforms the raw API response into React-friendly option structures
 */
const parseUiStructure = (nodes: any[]): { options: ConfiguratorDisplayOption[], selections: Selections } => {
  const options: ConfiguratorDisplayOption[] = [];
  const selections: Selections = {};

  const traverse = (node: any) => {
    // Case 1: Handle Text Decals based on documentation (type/subtype)
    if (node.type === 'decal' && node.subtype === 'text' && node.props?.text) {
      const textProps = node.props.text;

      const textOption = {
        type: 'text' as const,
        id: node.code,
        name: node.name,
        text: { propName: '', label: '', value: '' },
      };

      // Iterate over the properties within the 'text' object (e.g., text, font, fillcolor)
      for (const propName in textProps) {
        const prop = textProps[propName];

        // Skip properties that are not meant to be changed by the user
        if (!prop || prop.dynamic === false) continue;

        const optionId = `${node.code}:${propName}`;

        if (prop.type === 'text') {
          textOption.text = {
            propName: propName,
            label: prop.label,
            value: prop.value
          };
          selections[optionId] = prop.value;
        } else if (prop.type === 'list' && prop.items) {
          const itemValues = Object.values(prop.items);

          if (itemValues.length > 0) {
            const isColor = propName.toLowerCase().includes('color');
            
            const subOption = {
              id: optionId,
              name: prop.label,
              values: itemValues.map((item: any) => ({
                id: item.id,
                name: item.name,
                color: isColor ? `#${item.value}` : null,
                thumbnailUrl: null,
              })),
            };
            
            // Assign to font or color based on property name
            if (propName.toLowerCase().includes('font')) {
              (textOption as any).font = subOption;
            } else if (isColor) {
              (textOption as any).color = subOption;
            }
            
            if (prop.value) {
              selections[optionId] = prop.value;
            }
          }
        }
      }
      
      // Only add the component if it has a customizable text field
      if (textOption.text.propName) {
        options.push(textOption);
      }
    
    // Case 2: Handle all other standard components
    } else if (node.props) {
      for (const propName in node.props) {
        const prop = node.props[propName];
        // Standard components have an `items` function
        if (prop && typeof prop.items === 'function') {
          const items = prop.items();
          const itemValues = Object.values(items);

          if (itemValues.length > 0) {
            const optionId = `${node.code}:${propName}`;
            options.push({
              id: optionId,
              name: `${node.name} ${propName.charAt(0).toUpperCase() + propName.slice(1)}`,
              values: itemValues.map((item: any) => ({
                id: item.id,
                name: item.name,
                color: propName === 'color' ? `#${item.value}` : null,
                thumbnailUrl: propName === 'material' ? item.value : null,
              })),
            });
            if (prop.value) {
              selections[optionId] = prop.value;
            }
          }
        }
      }
    }

    if (node.children) {
      node.children.forEach(traverse);
    }
  };

  nodes.forEach(traverse);
  return { options, selections };
};

/**
 * Custom hook for Embodee 3D viewer integration
 * Manages state, API calls, and 3D viewer initialization
 */
export const useEmbodee = (): UseEmbodeeReturn => {
  // State management
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [configurator, setConfigurator] = useState<EmbodeeConfigurator | null>(null);
  const [productData, setProductData] = useState<EmbodeeProductData | null>(null);
  const [options, setOptions] = useState<ConfiguratorDisplayOption[]>([]);
  const [selections, setSelections] = useState<Selections>({});
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // Refs for managing the 3D viewer
  const configuratorRef = useRef<EmbodeeConfigurator | null>(null);
  const initializationRef = useRef<boolean>(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialize the Embodee 3D viewer and fetch product data
   */
  const initialize = useCallback(async (isRetry: boolean = false) => {
    if (initializationRef.current && !isRetry) return;
    
    if (!isRetry) {
      initializationRef.current = true;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsRetrying(isRetry);

      // Parse URL parameters
      const urlParams = getValidatedUrlParams();
      logConfiguratorInit(urlParams, `useEmbodee (attempt ${retryCount + 1})`);

      // Wait for EmbodeeLoader to be available with retry logic
      logger.debug('CONFIGURATOR', 'Waiting for EmbodeeLoader', {}, 'useEmbodee');
      await waitForEmbodeeLoaderWithRetry();
      logger.info('CONFIGURATOR', 'EmbodeeLoader is available', {}, 'useEmbodee');

      // Fetch product data from API with retry logic
      logger.debug('CONFIGURATOR', 'Fetching product data', { urlParams }, 'useEmbodee');
      const data = await fetchProductDataWithRetry(urlParams);
      setProductData(data);
      logger.info('CONFIGURATOR', 'Product data fetched successfully', { 
        hasConfig: !!data?.config,
        hasUI: !!data?.ui,
        hasLibrary: !!data?.library
      }, 'useEmbodee');

      // Initialize the 3D viewer with retry logic
      logger.debug('CONFIGURATOR', 'Initializing 3D viewer', { urlParams }, 'useEmbodee');
      const viewerConfig = await initializeViewerWithRetry(urlParams, data);
      setConfigurator(viewerConfig);
      configuratorRef.current = viewerConfig;
      logger.info('CONFIGURATOR', '3D viewer initialized successfully', {}, 'useEmbodee');

      // Set up event listeners
      setupViewerEvents(viewerConfig);

      // Reset retry state on success
      setRetryCount(0);
      setIsRetrying(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize configurator';
      
      // Determine if we should retry
      const shouldRetry = shouldRetryInitialization(err, retryCount);
      
      if (shouldRetry && retryCount < 3) {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        
        logApiError(err, `useEmbodee initialization failed (attempt ${nextRetryCount}), retrying in ${getRetryDelay(nextRetryCount)}ms`);
        
        // Schedule retry
        retryTimeoutRef.current = setTimeout(() => {
          initialize(true);
        }, getRetryDelay(nextRetryCount));
        
        setError(`Initialization failed, retrying... (${nextRetryCount}/3)`);
      } else {
        setError(errorMessage);
        logApiError(err, 'useEmbodee initialization - max retries exceeded');
        setIsRetrying(false);
      }
    } finally {
      if (!isRetrying) {
        setIsLoading(false);
      }
    }
  }, [retryCount, isRetrying]);

  /**
   * Wait for the EmbodeeLoader script to be available with retry logic
   */
  const waitForEmbodeeLoaderWithRetry = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const maxRetries = 150; // 150 * 200ms = 30 seconds timeout
      let attempt = 0;
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && 
            typeof (window as any).EmbodeeLoader?.init === 'function') {
          clearInterval(interval);
          resolve();
        } else if (++attempt > maxRetries) {
          clearInterval(interval);
          reject(new Error("The 3D viewer script failed to load in time."));
        }
      }, 200);
    });
  };

  /**
   * Fetch product data with retry logic
   */
  const fetchProductDataWithRetry = async (urlParams: URLParams): Promise<EmbodeeProductData> => {
    try {
      return await embodeeApi.getProductDataFromParams(urlParams);
    } catch (err) {
      logApiError(err, 'fetchProductDataWithRetry');
      throw err;
    }
  };

  /**
   * Initialize viewer with retry logic
   */
  const initializeViewerWithRetry = async (urlParams: URLParams, data: EmbodeeProductData): Promise<EmbodeeConfigurator> => {
    try {
      return await initializeViewer(urlParams, data);
    } catch (err) {
      logApiError(err, 'initializeViewerWithRetry');
      throw err;
    }
  };

  /**
   * Determine if initialization should be retried based on error type
   */
  const shouldRetryInitialization = (error: any, currentRetryCount: number): boolean => {
    // Don't retry if we've exceeded max retries
    if (currentRetryCount >= 3) return false;

    // Don't retry on certain error types
    if (error?.message?.includes('Invalid workspaceID') || 
        error?.message?.includes('Invalid productID') ||
        error?.message?.includes('Product not found')) {
      return false;
    }

    // Retry on network errors, timeouts, and API errors
    return true;
  };

  /**
   * Get retry delay with exponential backoff
   */
  const getRetryDelay = (retryCount: number): number => {
    return Math.min(1000 * Math.pow(2, retryCount - 1), 10000); // Max 10 seconds
  };

  /**
   * Initialize the 3D viewer with the given parameters
   */
  const initializeViewer = async (urlParams: URLParams, _data: EmbodeeProductData): Promise<EmbodeeConfigurator> => {
    const viewerConfig = await (window as any).EmbodeeLoader.init({
      containerID: 'embodee-configurator',
      workspaceID: urlParams.workspaceID,
      productCode: urlParams.productID,
      variant: urlParams.variant || 'Master',
      designID: urlParams.designID || 'false',
      width: urlParams.width || '100%',
      height: urlParams.height || '600px',
      host: urlParams.host || 'https://embodee.app',
    });

    return viewerConfig;
  };

  /**
   * Set up event listeners for the 3D viewer
   */
  const setupViewerEvents = (viewer: EmbodeeConfigurator) => {
    logger.debug('CONFIGURATOR', 'Setting up viewer events', {}, 'useEmbodee');
    
    const handleProductReady = () => {
      try {
        logger.debug('CONFIGURATOR', 'Product ready event received', {}, 'useEmbodee');
        
        const { options: parsedOptions, selections: parsedSelections } = parseUiStructure(viewer.uiStructure);
        setOptions(parsedOptions);
        setSelections(parsedSelections);
        setIsInitialized(true);

        logConfiguratorReady(parsedOptions, parsedSelections, 'useEmbodee');
        
        logger.info('CONFIGURATOR', 'Product ready - UI structure parsed successfully', {
          optionsCount: parsedOptions.length,
          selectionsCount: Object.keys(parsedSelections).length,
          optionTypes: parsedOptions.map(opt => (opt as any).type || 'unknown')
        }, 'useEmbodee');
      } catch (err) {
        logConfiguratorError(err, 'Product ready handler');
        setError('Failed to parse product options');
      }
    };

    viewer.subscribe(viewer.eventIDs.productReady, handleProductReady);
    logger.info('CONFIGURATOR', 'Viewer events subscribed successfully', {}, 'useEmbodee');
  };

  /**
   * Update a component value in the 3D viewer with retry logic
   */
  const setValue = useCallback(async (
    componentCode: string, 
    property: string, 
    value: string, 
    isCustom: boolean = false
  ) => {
    const viewer = configuratorRef.current;
    if (!viewer || !isInitialized) {
      throw new Error('Configurator not ready');
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await viewer.setComponentValue(componentCode, property, value, isCustom);
        
        // Update local state on success
        const optionId = `${componentCode}:${property}`;
        setSelections(prev => ({ ...prev, [optionId]: value }));
        
        // Clear any previous errors
        if (error && error.includes('setValue')) {
          setError(null);
        }
        
        return; // Success, exit retry loop
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');
        
        // Don't retry on certain error types
        if (err instanceof Error && (
          err.message.includes('Invalid component') ||
          err.message.includes('Invalid property') ||
          err.message.includes('Invalid value')
        )) {
          throw err;
        }
        
        // Log retry attempt
        if (attempt < maxRetries) {
          logApiError(err, `setValue retry ${attempt}/${maxRetries}: ${componentCode}:${property}`);
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
      }
    }
    
    // All retries failed
    const errorMessage = `Failed to set value after ${maxRetries} attempts: ${lastError?.message}`;
    logApiError(lastError, `setValue failed: ${componentCode}:${property}`);
    setError(errorMessage);
    throw new Error(errorMessage);
  }, [isInitialized, error]);

  /**
   * Get a component value from the 3D viewer
   */
  const getValue = useCallback((componentCode: string, property: string): string => {
    const viewer = configuratorRef.current;
    if (!viewer || !isInitialized) {
      return '';
    }

    try {
      return viewer.getComponentValue(componentCode, property);
    } catch (err) {
      logApiError(err, `getValue: ${componentCode}:${property}`);
      return '';
    }
  }, [isInitialized]);

  /**
   * Get current selections from the 3D viewer
   */
  const getSelections = useCallback((): Selections => {
    const viewer = configuratorRef.current;
    if (!viewer || !isInitialized) {
      return selections;
    }

    try {
      return viewer.getCurrentSelections();
    } catch (err) {
      logApiError(err, 'getSelections');
      return selections;
    }
  }, [isInitialized, selections]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * Manual retry function for user-initiated retries
   */
  const retry = useCallback(() => {
    if (isRetrying) return;
    
    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Reset initialization flag to allow retry
    initializationRef.current = false;
    setRetryCount(0);
    setError(null);
    
    // Start initialization
    initialize();
  }, [isRetrying, initialize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      
      if (configuratorRef.current) {
        // Cleanup any subscriptions or resources
        configuratorRef.current = null;
      }
    };
  }, []);

  return {
    configurator,
    isLoading,
    error,
    initialize,
    setValue,
    getValue,
    getSelections,
    // Additional state for components
    productData,
    options,
    selections,
    isInitialized,
    // Enhanced error handling and retry
    retry,
    retryCount,
    isRetrying
  };
};
