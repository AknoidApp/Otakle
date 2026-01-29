import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // todo lo que vaya a /api se manda al server de vercel dev
      '/api': 'http://localhost:3000',
    },
  },
})
