import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Extend process.env with loaded env vars for development
  process.env = { ...process.env, ...env }
  
  return {
    plugins: [react()],
    
    // Server configuration
    server: {
      port: 3001,
      open: true,
      host: true,
      strictPort: false,
      cors: true
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      target: 'es2015',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            icons: ['lucide-react']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    
    // Define global constants
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || mode),
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
    
    // Optimizations
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react'],
      esbuildOptions: {
        target: 'es2015'
      }
    },
    
    // TypeScript/ESBuild configuration
    esbuild: {
      target: 'es2015',
      platform: 'browser',
      supported: {
        'dynamic-import': true
      }
    },
    
    // Preview server settings
    preview: {
      port: 3001,
      strictPort: false,
      cors: true
    }
  }
})