import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, // Ensures it always uses 5173 so the browser connection is stable
    watch: {
        usePolling: true, // Forces file watching on Windows/Network drives
        interval: 100,
    },
    hmr: {
        // host: 'localhost', // Commenting out to allow network connections for HMR
        protocol: 'ws', // Explicitly use websocket for more stable HMR
        overlay: true, 
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
