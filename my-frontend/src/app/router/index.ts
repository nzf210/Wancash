// src/app/router/index.ts
import { nextTick } from 'vue';
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
  type NavigationGuardNext,
} from 'vue-router'
import { useAuth } from'@/app/composables/useAuth'

const modules = import.meta.glob('@/modules/**/index.ts', { eager: true });
const routes: RouteRecordRaw[] = [];

// Process module imports
Object.keys(modules).forEach((path) => {
  const module = modules[path];
  const routeModule = module?.default;
  if (routeModule && typeof routeModule === 'object' && routeModule !== null) {
    if (Array.isArray(routeModule)) {
      routes.push(...routeModule);
    } else {
      routes.push(routeModule as RouteRecordRaw);
    }
  }
});

// Rest of your code remains the same...
const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth as boolean | undefined);

  if (to.meta.requiresAuth) {
    sessionStorage.setItem('intended_route', to.fullPath)
  }

  if (!requiresAuth) return next();

  try {
    /**
     * const { useAuth } = await import('@/app/composables/useAuth');
     *
     */
    const { authStabilizing, isAuthenticated } = useAuth();

    console.log('🔑 [AuthGuard] Authenticated:', isAuthenticated.value, authStabilizing.value);

  if (authStabilizing.value) {
    return
  }

    if (isAuthenticated.value && !authStabilizing.value) {
      next();
    } else {
      next('/');
    }
  } catch (error) {
    console.error('Auth guard error:', error);
    next('/');
  }
};

const titleGuard = (to: RouteLocationNormalized) => {
  const defaultTitle = 'Wancash';
  const pageTitle = to.meta?.title as string | undefined;

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
