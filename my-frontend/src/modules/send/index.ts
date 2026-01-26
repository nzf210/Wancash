// src/modules/dashboard/index.ts
import buyWancash from './pages/SendTokenPage.vue'

export default [
  {
    path: '/sendToken',
    name: 'Sending Token',
    component: buyWancash,
    meta: {
      title: 'Sending Token',
      requiresAuth: true
    }
  },
  {
    path: '/historySending',
    name: 'Transaction History',
    component: () => import('./pages/HistoryPage.vue'),
    meta: {
      title: 'Transaction History',
      requiresAuth: true
    }
  }
]
