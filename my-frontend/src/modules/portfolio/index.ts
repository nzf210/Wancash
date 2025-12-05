// src/modules/dashboard/index.ts
import buyWancash from './pages/PortfolioPage.vue'

import type { RouteRecordRaw } from 'vue-router'

// @/modules/portfolio/index.ts

const routes: RouteRecordRaw[] = [
  {
    path: '/portfolio',
    name: 'portfolio',
    component: buyWancash
  }
]

export default routes
