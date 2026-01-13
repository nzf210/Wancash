import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/notifications',
        name: 'notifications',
        component: () => import('./pages/NotificationsPage.vue'),
        meta: {
            title: 'Notifications',
            requiresAuth: true
        }
    }
]

export default routes
