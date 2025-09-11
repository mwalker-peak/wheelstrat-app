import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    host: true, // Allow external connections for mobile testing
  },
  build: {
    target: 'es2015',
    sourcemap: true,
  },
})
