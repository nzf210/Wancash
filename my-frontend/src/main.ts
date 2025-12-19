// ===== file: main.ts =====
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/app/router/index'
import { createPinia } from 'pinia'
import { WagmiPlugin, type WagmiPluginOptions } from '@wagmi/vue'
import { wagmiConfig } from '@/app/components/config/appkit'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { LitElement } from 'lit'
import { useAuthStore } from './app/stores/auth'

LitElement.enableWarning = function () {};

import './assets/style.css' // Tailwind + ShadCN
import type { Router } from 'vue-router'

const pinia = createPinia()
function initializeStores(router: Router) {
  pinia.use(() => ({ $router: router }))
}
async function initializeApp() {
  const app = createApp(App)
  app.use(router)
  await router.isReady()
  initializeStores(router)

  app.use(pinia)
  await router.isReady()

  const queryClient = new QueryClient()

  await new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve(void 0)
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve(void 0))
    }
  })

  app.use(WagmiPlugin, {config: wagmiConfig} as WagmiPluginOptions)
  app.use(VueQueryPlugin, { queryClient })

  const auth = useAuthStore()
  await auth.init()

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
}

// Initialize with error handling
initializeApp().catch((error) => {
  console.error('💥 Application initialization failed:', error)
  document.body.innerHTML = `
    <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
      <h1>Application Error</h1>
      <p style="color: #666; margin: 1rem 0;">${error.message}</p>
      <button onclick="window.location.reload()" style="
        padding: 0.5rem 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      ">Reload Application</button>
    </div>
  `
})

