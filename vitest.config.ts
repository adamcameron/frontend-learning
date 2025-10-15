import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/*.d.ts', '**/*.config.*', './tests/setup.ts'],
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
  },
})
