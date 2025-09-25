import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production-specific configuration for iframe embedding
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          embodee: []
        },
        // Optimize file naming for CDN caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    target: 'es2015',
    cssCodeSplit: true,
    // Maximum chunk size warning
    chunkSizeWarningLimit: 1000
  },
  // Production optimizations
  define: {
    __DEV__: 'false',
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  // Base path for production deployment
  base: './',
  // Asset handling
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin']
})
