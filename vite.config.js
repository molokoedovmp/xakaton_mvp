import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api/parse-teacher': {
        target: 'https://www.hse.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/parse-teacher/, '/org/persons')
      }
    }
  }
})
