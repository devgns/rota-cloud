import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 1200,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
