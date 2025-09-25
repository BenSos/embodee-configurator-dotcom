// Embodee 3D Viewer Script Loader
// This script loads the Embodee 3D viewer and makes it available globally
// Optimized for iframe embedding with enhanced error handling

(function() {
  'use strict';
  
  // Configuration
  const EMBODEE_SCRIPT_URL = 'https://embodee.app/embodee-loader.js';
  const LOAD_TIMEOUT = 30000; // 30 seconds
  const RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 2000; // 2 seconds
  
  let isLoaded = false;
  let isLoading = false;
  let retryCount = 0;
  const callbacks = [];
  const errorCallbacks = [];
  
  // Load the Embodee script with retry logic
  function loadEmbodeeScript() {
    if (isLoaded || isLoading) return;
    
    isLoading = true;
    
    const script = document.createElement('script');
    script.src = EMBODEE_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = function() {
      isLoaded = true;
      isLoading = false;
      retryCount = 0;
      
      console.log('Embodee script loaded successfully');
      
      // Execute all pending callbacks
      callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in Embodee callback:', error);
        }
      });
      callbacks.length = 0;
    };
    
    script.onerror = function() {
      isLoading = false;
      retryCount++;
      
      console.error(`Failed to load Embodee script (attempt ${retryCount}/${RETRY_ATTEMPTS})`);
      
      if (retryCount < RETRY_ATTEMPTS) {
        // Retry after delay
        setTimeout(() => {
          console.log(`Retrying Embodee script load (attempt ${retryCount + 1})`);
          loadEmbodeeScript();
        }, RETRY_DELAY);
      } else {
        // Max retries reached, notify error callbacks
        errorCallbacks.forEach(callback => {
          try {
            callback(new Error('Failed to load Embodee script after maximum retries'));
          } catch (error) {
            console.error('Error in Embodee error callback:', error);
          }
        });
        errorCallbacks.length = 0;
      }
    };
    
    document.head.appendChild(script);
    
    // Timeout fallback
    setTimeout(() => {
      if (!isLoaded && isLoading) {
        isLoading = false;
        console.error('Embodee script load timeout');
        
        // Notify error callbacks
        errorCallbacks.forEach(callback => {
          try {
            callback(new Error('Embodee script load timeout'));
          } catch (error) {
            console.error('Error in Embodee error callback:', error);
          }
        });
        errorCallbacks.length = 0;
      }
    }, LOAD_TIMEOUT);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEmbodeeScript);
  } else {
    loadEmbodeeScript();
  }
  
  // Expose global API with enhanced error handling
  window.EmbodeeLoader = {
    init: function(options) {
      return new Promise((resolve, reject) => {
        if (isLoaded && window.Embodee && window.Embodee.init) {
          // Script is already loaded, use the real API
          try {
            window.Embodee.init(options)
              .then(resolve)
              .catch(reject);
          } catch (error) {
            reject(error);
          }
        } else {
          // Wait for script to load
          callbacks.push(() => {
            if (window.Embodee && window.Embodee.init) {
              try {
                window.Embodee.init(options)
                  .then(resolve)
                  .catch(reject);
              } catch (error) {
                reject(error);
              }
            } else {
              reject(new Error('Embodee API not available'));
            }
          });
          
          // Add error callback
          errorCallbacks.push((error) => {
            reject(error);
          });
        }
      });
    },
    
    // Check if Embodee is loaded
    isLoaded: function() {
      return isLoaded && window.Embodee;
    },
    
    // Get loading status
    isLoading: function() {
      return isLoading;
    },
    
    // Retry loading
    retry: function() {
      if (!isLoaded && !isLoading) {
        retryCount = 0;
        loadEmbodeeScript();
      }
    },
    
    // Add error callback
    onError: function(callback) {
      errorCallbacks.push(callback);
    }
  };
  
  // Iframe communication helpers
  if (window.parent !== window) {
    // Notify parent when Embodee is ready
    callbacks.push(() => {
      window.parent.postMessage({
        type: 'embodee-ready',
        source: 'configurator'
      }, '*');
    });
    
    // Handle resize requests from parent
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'resize-configurator') {
        const { width, height } = event.data;
        if (width && height) {
          document.body.style.width = width + 'px';
          document.body.style.height = height + 'px';
        }
      }
    });
  }
})();
