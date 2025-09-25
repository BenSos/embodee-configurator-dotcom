import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    cors: true,
    open: true,
    hmr: {
      overlay: true
    },
    headers: {
      // Security headers for iframe embedding
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "default-src 'self'; font-src 'self' https://r2cdn.perplexity.ai; frame-ancestors 'self' https://embodee.com https://*.embodee.com",
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        },
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Optimize for iframe embedding
    target: 'es2015',
    cssCodeSplit: true,
    // Ensure proper iframe compatibility
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    // Pre-bundle dependencies for faster loading
    force: true
  },
  // Define global constants for build-time optimization
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  // CSS optimization
  css: {
    devSourcemap: true
  },
  // Asset handling for iframe embedding
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin'],
  // Base path for iframe embedding
  base: './',
  // Path resolution for TypeScript path mapping
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/styles': path.resolve(__dirname, './src/styles')
    }
  }
})
