import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fl41_form: resolve(__dirname, 'pages/fl-41/state/form/index.html'),
        fl41_accordion: resolve(
          __dirname,
          'pages/fl-41/state/accordion/index.html'
        ),
        fl41_chat: resolve(__dirname, 'pages/fl-41/state/chat/index.html'),
        fl41_tasks: resolve(__dirname, 'pages/fl-41/state/tasks/index.html'),
        fl41_sections: resolve(
          __dirname,
          'pages/fl-41/state/sections/index.html'
        ),
        fl41_tasks2: resolve(__dirname, 'pages/fl-41/state/tasks2/index.html'),
        fl48_useref: resolve(__dirname, 'pages/fl-48/useref/index.html'),
      },
    },
  },
})
