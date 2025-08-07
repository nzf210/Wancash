// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './app/router'

import './assets/style.css' // Tailwind + ShadCN

createApp(App).use(router).mount('#app')
