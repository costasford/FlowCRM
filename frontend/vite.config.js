import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/FlowCRM/',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    'process.env.VITE_DEMO_MODE': JSON.stringify(process.env.VITE_DEMO_MODE)
  }
})
