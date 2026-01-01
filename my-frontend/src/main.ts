// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { WagmiPlugin, type WagmiPluginOptions } from '@wagmi/vue'
import { wagmiConfig } from '@/app/components/config/appkit'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { LitElement } from 'lit'
import router from '@/app/router/index'
import type { Router } from 'vue-router'

import './assets/style.css'

LitElement.enableWarning = function () {};

const pinia = createPinia()
function initializeStores(router: Router) {
  pinia.use(() => ({ $router: router }))
}
async function initializeApp() {
  try {

    const app = createApp(App)
    app.use(pinia)  // Install Pinia first to establish the active context
    app.use(WagmiPlugin, {config: wagmiConfig , reconnectOnMount: true} as WagmiPluginOptions)  // Install Wagmi next
    app.use(router)  // Install router after Pinia and Wagmi
    await router.isReady()
    initializeStores(router)

    const queryClient = new QueryClient()

    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve(void 0)
      } else {
        document.addEventListener('DOMContentLoaded', () => resolve(void 0))
      }
    })

    app.use(VueQueryPlugin, { queryClient })
    const mount = () => {
      const rootElement = document.getElementById('app')
      if (!rootElement) {
        const fallbackElement = document.createElement('div')
        fallbackElement.id = 'app'
        document.body.appendChild(fallbackElement)
      }
      app.mount('#app')
    }

    mount()

  } catch (error : unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('💥 Application initialization failed:', error)
    document.body.innerHTML = `
      <div style="padding:2rem;font-family:sans-serif;text-align:center;">
        <h1>Application Error</h1>
        <p style="color:#666;margin:1rem 0;">${message}</p>
        <button onclick="window.location.reload()" style="
          padding:.5rem 1rem;
          background:#007bff;
          color:#fff;
          border:none;
          border-radius:4px;
          cursor:pointer;
        ">Reload Application</button>
      </div>
    `
  }
}

await initializeApp()
