import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Explicitly disable all PostCSS processing
  css: {
    postcss: false
  }
})