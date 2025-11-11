// /frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Para usar 'describe', 'it', 'vi', etc. globalmente
    environment: 'jsdom', // Para simular el DOM del navegador
    // NO usamos setupFiles para evitar el error de resolución.
    exclude: [...configDefaults.exclude, 'e2e/**'], 
    coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
    },
  },
  // ------------------------------------------
})