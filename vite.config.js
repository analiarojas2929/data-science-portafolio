import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Asegúrate de que coincida con tu workflow
    emptyOutDir: true
  }
})