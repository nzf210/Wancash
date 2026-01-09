
export default [
    {
        path: '/settings',
        name: 'settings',
        component: () => import('./pages/SettingsPage.vue'),
        meta: {
            title: 'Settings',
            requiresAuth: true
        }
    }
]
