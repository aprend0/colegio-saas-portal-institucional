import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuración de Vite — bundler del frontend React.js
export default defineConfig({
  plugins: [
    react(),        // Plugin de React para Vite
    tailwindcss(),  // Plugin de Tailwind CSS para estilos
  ],
  server: {
    port: 5173, // Puerto del servidor de desarrollo
  }
})