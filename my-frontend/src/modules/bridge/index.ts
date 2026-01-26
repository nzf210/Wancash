// src/modules/dashboard/index.ts
import buyWancash from './pages/BuyTokenPage.vue'
import BridgeHistoryPage from './pages/BridgeHistoryPage.vue'

export default [
  {
    path: '/bridgeToken',
    name: 'Bridge Token',
    component: buyWancash,
    meta: {
      title: 'Bridge Token',
      requiresAuth: true
    }
  },
  {
    path: '/bridge/history',
    name: 'Bridge History',
    component: BridgeHistoryPage,
    meta: {
      title: 'Bridge History',
      requiresAuth: true
    }
  }
]
