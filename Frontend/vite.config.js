import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server : {
    proxy : {
      '/api/v1' : {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // This will make sure that wherever /api is written the link provided gets appended before it further, the proxy is given that the request is coming from the same link which will remove the cross origin !!
    }
  },
})
