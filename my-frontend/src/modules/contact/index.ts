import ContactPage from './pages/ContactPage.vue'

export default [
  {
    path: '/support',
    name: 'Contact Us',
    component: ContactPage,
    meta: {
      title: 'Support',
      requiresAuth: false,
    }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('@/modules/support/views/FAQ.vue'),
    meta: {
      title: 'FAQ',
      requiresAuth: false,
    }
  }
]
