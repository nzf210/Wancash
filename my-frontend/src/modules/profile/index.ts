import TransferPage from './pages/ProfilePage.vue'

export default [
  {
    path: '/profile',
    name: 'User Profile',
    component: TransferPage,
    meta: {
      title: 'User Profile',
      requiresAuth: true
    }
  }
]
