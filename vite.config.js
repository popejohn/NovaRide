import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/locationiq': {
        target: 'https://us1.locationiq.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          // Handle different LocationIQ endpoints
          if (path.includes('/reverse.php')) {
            return path.replace(/^\/api\/locationiq/, '/v1');
          } else if (path.includes('/search.php')) {
            return path.replace(/^\/api\/locationiq/, '/v1');
          } else if (path.includes('/directions/driving')) {
            return path.replace(/^\/api\/locationiq/, '/v1');
          }
          return path.replace(/^\/api\/locationiq/, '/v1');
        }
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
