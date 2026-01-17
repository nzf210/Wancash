// About module routes
import type { RouteRecordRaw } from 'vue-router';

const aboutRoutes: RouteRecordRaw = {
    path: '/about',
    name: 'AboutUs',
    component: () => import('./views/AboutUs.vue'),
    meta: {
        title: 'About Us',
        requiresAuth: false,
    },
};

export default aboutRoutes;
