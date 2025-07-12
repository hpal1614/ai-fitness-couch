// =====================================================================================
// ⚡ VITE CONFIGURATION - AI FITNESS COACH
// =====================================================================================
// FILE LOCATION: vite.config.js (root directory)
// Created by Himanshu (himanshu1614)
// Fixed ES Module syntax for Vite

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server configuration
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  
  // Optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
})