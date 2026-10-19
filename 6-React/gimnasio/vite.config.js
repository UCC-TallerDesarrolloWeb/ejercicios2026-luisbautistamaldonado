import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Convierte una ruta relativa a este archivo en ruta absoluta
const ruta = (carpeta) => fileURLToPath(new URL(carpeta, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Alias para no escribir rutas relativas largas (../../components/...)
    alias: {
      '@components': ruta('./src/components'),
      '@pages': ruta('./src/pages'),
      '@styles': ruta('./src/styles'),
      '@assets': ruta('./src/assets'),
      '@data': ruta('./src/data'),
    },
  },
})
