import type { RouteRecordRaw } from 'vue-router'

// Admin Dashboard (with tabs)
import AdminDashboard from './pages/AdminDashboard.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/admin',
        name: 'Admin Dashboard',
        component: AdminDashboard,
        meta: {
            title: 'Admin Dashboard',
            requiresAuth: true,
            requiresAdmin: true
        }
    }
]

export default routes
