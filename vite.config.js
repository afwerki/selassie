import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // allow LAN & ngrok
    port: 5173,
    allowedHosts: true, // ✅ FIX: allow ngrok domains
    hmr: {
      clientPort: 443, // ✅ FIX: websocket works over ngrok
    },
  },
})
