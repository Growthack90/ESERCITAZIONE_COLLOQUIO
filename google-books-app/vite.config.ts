import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/ESERCITAZIONE_COLLOQUIO/',
  plugins: [react()],
})
