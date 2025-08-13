// ===== file: main.ts =====
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/app/router/index'
import {  wagmiConfig } from '@/app/components/config/appkit'
import { createPinia } from 'pinia'
import { WagmiPlugin } from '@wagmi/vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { LitElement } from 'lit'

// Nonaktifkan warning Lit
LitElement.enableWarning = function () {};

import './assets/style.css' // Tailwind + ShadCN

// Define adapter typ
async function initializeApp() {
  const app = createApp(App)

  const queryClient = new QueryClient()
  app.use(WagmiPlugin, { config: wagmiConfig })
  app.use(VueQueryPlugin, { queryClient })
  // Setup plugins
  app.use(createPinia())
  app.use(router)
  await router.isReady()

  // Wait for DOM
  await new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve(void 0)
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve(void 0))
    }
  })

  // Mount app
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

