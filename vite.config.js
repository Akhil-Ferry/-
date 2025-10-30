import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // use relative base for easier GitHub Pages deployment
  plugins: [react()],
})
