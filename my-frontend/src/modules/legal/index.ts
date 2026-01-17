// Legal module routes
import type { RouteRecordRaw } from 'vue-router';

const legalRoutes: RouteRecordRaw[] = [
    {
        path: '/terms',
        name: 'TermsOfService',
        component: () => import('./views/TermsOfService.vue'),
        meta: {
            title: 'Terms of Service',
            requiresAuth: false,
        },
    },
    {
        path: '/privacy',
        name: 'PrivacyPolicy',
        component: () => import('./views/PrivacyPolicy.vue'),
        meta: {
            title: 'Privacy Policy',
            requiresAuth: false,
        },
    },
    {
        path: '/disclaimer',
        name: 'Disclaimer',
        component: () => import('./views/Disclaimer.vue'),
        meta: {
            title: 'Disclaimer',
            requiresAuth: false,
        },
    },
];

export default legalRoutes;
