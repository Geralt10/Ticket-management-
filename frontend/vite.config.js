import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-three/fiber') || id.includes('three')) {
            return 'three-core'
          }

          if (
            id.includes('react-router-dom') ||
            id.includes('react-dom') ||
            id.includes('react/jsx-runtime') ||
            id.includes('/react/')
          ) {
            return 'react-core'
          }

          if (id.includes('framer-motion')) {
            return 'motion-core'
          }

          return undefined
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
