import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/-/', // must match your GitHub Pages URL path
  plugins: [react()],
})
