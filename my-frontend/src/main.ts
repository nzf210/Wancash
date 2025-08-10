// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/app/router/index'
import { createPinia } from 'pinia'
import { WagmiPlugin } from '@wagmi/vue'
import { config } from '@/app/components/config/wagmi'
import { appkit } from '@/app/components/config/appkit'
import { VueQueryPlugin } from '@tanstack/vue-query'


import './assets/style.css' // Tailwind + ShadCN

const app = createApp(App)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 2
      }
    }
  }
})
app.provide('appkit', appkit)
app.use(WagmiPlugin, { config })
app.use(createPinia())
app.use(router)
app.mount('#app')
