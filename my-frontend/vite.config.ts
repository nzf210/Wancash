import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
    define: {
    __DEV__: JSON.stringify(false), // Force Lit production mode
    'import.meta.env.PROD': JSON.stringify(true) // Jika diperlukan
  },
  envDir: '.',
  envPrefix: 'VITE_',
  build: {
    minify: 'terser',
    terserOptions: {
      maxWorkers: 4
    },
  }

})
