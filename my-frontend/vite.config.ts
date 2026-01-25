import 'dotenv/config'; // Load .env files otomatis
import { fileURLToPath, URL } from 'node:url';
import http from 'node:http'; // Tambah ini buat http agent
import https from 'node:https';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => { // Ambil mode dari Vite (dev/build)
  // Tentuin target proxy dinamis berdasarkan environment
  const proxyTarget = process.env.VITE_CLOUDE_WORKER ?? 'http://localhost:8787'; // Default local buat dev

  // Pilih agent berdasarkan protocol target (http atau https)
  const isHttps = proxyTarget.startsWith('https://');
  const agent = isHttps
    ? new https.Agent({
      rejectUnauthorized: false, // Dev only, matiin kalau prod aman
      keepAlive: true,
      timeout: 120000,
    })
    : new http.Agent({
      keepAlive: true,
      timeout: 120000,
    });

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.ico', 'wancash.png', 'pwa-192x192.png', 'pwa-512x512.png', 'safari-pinned-tab.svg'],
        manifest: {
          name: 'Wancash - Cross-Chain Bridge',
          short_name: 'Wancash',
          description: 'Bridge WCH tokens seamlessly across blockchains',
          theme_color: '#8b5cf6',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 // 6MB
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __DEV__: JSON.stringify(mode === 'development'), // Dinamis berdasarkan mode
      // 'import.meta.env.PROD': JSON.stringify(mode === 'production'),
    },
    envDir: '.', // Root project
    envPrefix: 'VITE_',
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: 2000,
      terserOptions: {
        maxWorkers: 4,
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget, // Dinamis!
          changeOrigin: true,
          secure: isHttps, // Auto detect protocol buat secure
          ws: true,
          timeout: 120000, // 2 menit, cukup buat slow connect
          proxyTimeout: 120000,
          agent, // Pakai agent dinamis di atas
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Connection', 'keep-alive');
              console.log(`Proxying request to: ${proxyTarget}`); // Logging buat debug
            });
            proxy.on('error', (err) => {
              console.error('Proxy error detail:', err.message); // Lebih detail
            });
          },
        },
      },
    },
  };
});
