import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/CCA-F-learn/',
  plugins: [react()],
  resolve: {
    alias: {
      '@/projects': path.resolve(import.meta.dirname, 'src/data/myProjects.js'),
    },
  },
})
