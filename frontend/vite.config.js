import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: true,
    // Proxy solo activo en desarrollo local
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Genera sourcemaps para debugging en producción
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separar Three.js en su propio chunk (ya está con lazy)
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':     ['lucide-react', 'react-hot-toast'],
          'vendor-axios':  ['axios'],
        },
      },
    },
  },
})
