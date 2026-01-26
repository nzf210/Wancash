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
import VueApexCharts from 'vue3-apexcharts'
import { createHead } from '@unhead/vue/client'
import i18n from '@/modules/i18n'
import * as Sentry from "@sentry/vue";

import '../src/assets/style.css'

LitElement.enableWarning = function () { };

const pinia = createPinia()
function initializeStores(router: Router) {
  pinia.use(() => ({ $router: router }))
}
async function initializeApp() {
  try {

    const app = createApp(App)
    const head = createHead()
    app.use(head)
    app.use(i18n)

    // Sentry Initialization
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN, // Don't forget to add this to .env
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });

    app.use(pinia)  // Install Pinia first to establish the active context
    app.use(WagmiPlugin, { config: wagmiConfig, reconnectOnMount: true } as WagmiPluginOptions)  // Install Wagmi next
    app.use(router)  // Install router after Pinia and Wagmi
    app.use(VueApexCharts)
    await router.isReady()
    initializeStores(router)

    const queryClient = new QueryClient()

    await new Promise(resolve => {
      // If document is already interactive or complete, we can proceed
      if (document.readyState !== 'loading') {
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

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('💥 Application initialization failed:', error);

    document.body.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        color: #0f172a; padding: 1rem; box-sizing: border-box;
      ">
        <div style="
          background: white; max-width: 480px; w-full; border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 2.5rem; border: 1px solid #e2e8f0; text-align: center;
        ">
          <div style="
            width: 64px; height: 64px; background-color: #fef2f2; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          
          <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; color: #1e293b;">
            Unable to Load Application
          </h1>
          
          <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">
            We encountered a critical error while starting the system. This might be due to a network issue or a temporary service disruption.
          </p>
          
          <div style="margin-bottom: 2rem;">
            <button onclick="window.location.reload()" style="
              background-color: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem;
              font-size: 0.95rem; font-weight: 600; border-radius: 8px; cursor: pointer;
              transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
              width: 100%;
            " onmouseover="this.style.backgroundColor='#1d4ed8'" onmouseout="this.style.backgroundColor='#2563eb'">
              Retry Connection
            </button>
          </div>
          
          <details style="text-align: left; background: #f1f5f9; padding: 0.75rem; border-radius: 6px; border: 1px solid #cbd5e1;">
            <summary style="cursor: pointer; color: #475569; font-size: 0.85rem; font-weight: 600;">
              Technical Details
            </summary>
            <div style="margin-top: 0.5rem; font-family: monospace; font-size: 0.75rem; color: #334155; overflow-x: auto; white-space: pre-wrap; max-height: 150px; overflow-y: auto;">
              ${message}
            </div>
          </details>
          
          <div style="margin-top: 1.5rem; pt: 1rem; border-top: 1px solid #f1f5f9; font-size: 0.85rem; color: #94a3b8;">
            Error Code: INITIALIZATION_FAILURE
          </div>
        </div>
      </div>
    `;
  }
}

await initializeApp()
