// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/app/router/index'
import { createPinia } from 'pinia'
import { WagmiPlugin } from '@wagmi/vue'
import { config } from '@/app/components/config/wagmi'
import { appkit } from '@/app/components/config/appkit'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { LitElement } from 'lit'
// Nonaktifkan warning Lit
LitElement.enableWarning = () => {}

import './assets/style.css' // Tailwind + ShadCN

async function checkPersistedSession() {
  if (localStorage.getItem('walletConnected') === 'true') {
    try {
      await appkit.open()
    } catch (error) {
      console.error('Auto-connect failed:', error);
      localStorage.removeItem('walletConnected');
      throw error;
    }
  }
}


async function initializeApp() {
  const app = createApp(App)

  // Pasang plugin SEBELUM mounting
  app.use(createPinia())
  app.use(router)
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 3
        }
      }
    }
  })
  app.use(WagmiPlugin, { config })
  app.provide('appkit', appkit)



// Panggil sebelum mount
await checkPersistedSession()

  // Tunggu router siap (jika menggunakan route guards)
  await router.isReady()

  // Mount aplikasi
  const mount = () => {
    const rootElement = document.getElementById('app')
    if (!rootElement) {
      const fallbackElement = document.createElement('div')
      fallbackElement.id = 'app'
      document.body.appendChild(fallbackElement)
    }
    app.mount('#app')
  }

  if (document.readyState === 'complete') {
    mount()
  } else {
    document.addEventListener('DOMContentLoaded', mount)
  }
}

initializeApp().catch((error) => {
  console.error('Application initialization failed:', error)
  // Fallback UI error
  document.body.innerHTML = `
    <div style="padding: 2rem; font-family: sans-serif">
      <h1>Application Error</h1>
      <p>${error.message}</p>
      <button onclick="window.location.reload()">Reload</button>
    </div>
  `
})


if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    localStorage.removeItem('wagmi.cache')
  })
}
