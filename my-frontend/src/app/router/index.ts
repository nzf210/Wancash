import { authService } from '@/utils/auth.service';
import { nextTick } from 'vue';
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router';

// Automatically import routes from module index files
const modules = import.meta.glob('@/modules/**/index.ts', { eager: true });

const routes: RouteRecordRaw[] = [];

for (const path in modules) {
  // Each index.ts in modules must export default RouteRecordRaw[]
  const mod = (modules[path] as { default: RouteRecordRaw | RouteRecordRaw[] }).default;
  if (mod) {
    if (Array.isArray(mod)) {
      routes.push(...mod);
    } else {
      routes.push(mod);
    }
  }
}

// Helper function to validate authentication
const validateAuthentication = async (): Promise<boolean> => {
  if (!authService.isAuthenticated) {
    return false;
  }

  const token = authService.token.value;
  if (!token) {
    return false;
  }

  try {
    return await authService.validateToken(token);
  } catch {
    return false;
  }
};

// Modern Vue Router 4 authentication guard (return-based navigation)
const authGuard = async (to: RouteLocationNormalized): Promise<void | string | boolean> => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth as boolean | undefined);

  if (!requiresAuth) {
    return; // Proceed with navigation
  }

  const isAuthenticated = await validateAuthentication();

  if (isAuthenticated) {
    return; // Proceed with navigation
  }

  return '/'; // Redirect to login
};

// Title guard
const titleGuard = (to: RouteLocationNormalized) => {
  const defaultTitle = 'Wancash'; // Replace with your application name
  const pageTitle = to.meta.title as string | undefined;

  nextTick(() => {
    document.title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  });
};

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);
router.afterEach(titleGuard);

export default router;
