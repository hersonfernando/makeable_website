import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: ['makeable.test', 'makeable.io.test'],
    // Polling avoids Windows file-lock errors when assets are copied into public.
    watch: process.platform === 'win32' ? { usePolling: true, interval: 300 } : undefined,
  },
})
