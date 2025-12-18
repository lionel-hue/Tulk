// front/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add Tailwind v4 support
  ],
  server: {
    host: '0.0.0.0', // Allow mobile access
    port: 3000, // Different from Laravel's 8000
    cors: true,
  },
})