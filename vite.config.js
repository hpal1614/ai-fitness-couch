import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server configuration - Port 3001 with better error handling
  server: {
    port: 3001,
    open: true,
    host: true,
    strictPort: false, // Allow fallback to other ports if 3001 is busy
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none'
    }
  },
  
  // Build configuration - Fixed for better browser compatibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    target: 'es2015', // Changed from 'esnext' to better browser support
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        },
        // Ensure consistent chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Add fallbacks for undefined globals
    'global': 'globalThis',
  },
  
  // Resolve configuration with path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/config': resolve(__dirname, './src/config'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
      '@/security': resolve(__dirname, './src/security')
    }
  },
  
  // Optimizations - Fixed for better stability
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    esbuildOptions: {
      target: 'es2015'
    }
  },
  
  // TypeScript/ESBuild configuration - More conservative settings
  esbuild: {
    target: 'es2015', // Changed from 'esnext' for better compatibility
    platform: 'browser',
    supported: {
      'dynamic-import': true
    }
  },
  
  // Preview server settings (for production builds)
  preview: {
    port: 3001,
    strictPort: false,
    cors: true
  }
})