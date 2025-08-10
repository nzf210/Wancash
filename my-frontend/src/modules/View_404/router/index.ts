import NotFound from '@/modules/View_404/pages/NotFound.vue'

const notFoundRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Halaman Tidak Ditemukan'
    }
  }
]

export default notFoundRoutes
