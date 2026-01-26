import TransferPage from './pages/RedemPage.vue'

export default [
  {
    path: '/redem',
    name: 'Redemption Token',
    component: TransferPage,
    meta: {
      title: 'Redemption Token',
      requiresAuth: true
    }
  }
]
