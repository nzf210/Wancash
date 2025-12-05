// src/modules/dashboard/index.ts
import buyWancash from './pages/BuyTokenPage.vue'

export default [
  {
    path: '/bridgeToken',
    name: 'Bridge Token',
    component: buyWancash
  }
]
