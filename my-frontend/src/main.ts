// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/app/router/index'
import { createPinia } from 'pinia'

import './assets/style.css' // Tailwind + ShadCN

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
