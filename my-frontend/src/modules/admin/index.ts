import type { RouteRecordRaw } from 'vue-router'

// Admin Dashboard (with tabs)
import AdminDashboard from './pages/AdminDashboard.vue'
import DatabaseManager from './pages/DatabaseManager.vue'

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
    },
    {
        path: '/admin/database',
        name: 'Database Manager',
        component: DatabaseManager,
        meta: {
            title: 'Database Manager',
            requiresAuth: true,
            requiresAdmin: true
        }
    }
]

export default routes
