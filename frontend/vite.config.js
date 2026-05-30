// Vite development configuration
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to Django during dev
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    }
  },
  build: {
    outDir: 'dist',
  }
})
