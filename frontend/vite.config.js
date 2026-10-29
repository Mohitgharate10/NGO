import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main:      resolve(__dirname, 'index.html'),
        volunteer: resolve(__dirname, 'volunteer.html'),
        donor:     resolve(__dirname, 'donor.html'),
        admin:     resolve(__dirname, 'admin.html'),
      },
    },
  },
})