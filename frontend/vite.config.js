import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: false, // Set to false for faster incremental builds
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
        usePolling: true, // Forces file watching for auto-refresh on Windows
        interval: 100,
    },
    hmr: {
        host: 'localhost',
        overlay: true, // Shows a clean error popup so you don't have to check console
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
