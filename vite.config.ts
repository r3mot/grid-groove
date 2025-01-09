/// <reference types="vitest/config" />
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    deps: {
      optimizer: {
        web: {
          include: ['@radix-ui'],
        },
      },
    },
    coverage: {
      provider: 'istanbul',
      exclude: ['**/components/ui/**', '**/components/icons/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
