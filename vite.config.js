import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // loadEnv ist hier immer noch nützlich, wenn du z.B. andere Frontend-spezifische
  // Umgebungsvariablen in .env definieren willst, die Vite verarbeiten soll.
  // Für diesen speziellen Fall benötigen wir es hier nicht, aber es schadet nicht.
  // const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        // Leitet alle Anfragen, die mit '/api' beginnen, an unseren Node.js-Server weiter
        '/api': 'http://localhost:3000', // Oder den Port, den dein Backend nutzt
      }
    }
  }
})