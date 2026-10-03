import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createContactHandler } from './server/contact.js'

export default defineConfig(({ mode }) => {
  // SMTP values are read only by the server; Vite exposes only VITE_ variables.
  const emailEnv = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  const contactApi = {
    name: 'contact-api',
    configureServer(server) { server.middlewares.use(createContactHandler(emailEnv)) },
    configurePreviewServer(server) { server.middlewares.use(createContactHandler(emailEnv)) },
  }
  return {
    plugins: [vue(), contactApi],
    server: {
      port: 5173,
      strictPort: true,
      allowedHosts: ['makeable.test', 'makeable.io.test'],
      // Polling avoids Windows file-lock errors when assets are copied into public.
      watch: process.platform === 'win32' ? { usePolling: true, interval: 300 } : undefined,
    },
  }
})
