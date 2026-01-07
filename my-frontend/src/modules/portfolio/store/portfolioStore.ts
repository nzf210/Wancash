// src/app/stores/navigation.ts
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useNavigationStore = defineStore('navigation', () => {
  const router = useRouter()

  const routes = {
    portfolio: '/portfolio',
    settings: '/settings',
    profile: '/profile',
    dashboard: '/',
  }

  const goToPortfolio = () => router.push(routes.portfolio)
  const goToSettings = () => router.push(routes.settings)
  const goToProfile = () => router.push(routes.profile)
  const goToDashboard = () => router.push(routes.dashboard)

  const goTo = (path: typeof routes | string) => {
    const routePath = routes[path as keyof typeof routes] ?? path
    router.push(routePath)
  }

  return {
    routes,
    goToPortfolio,
    goToSettings,
    goToProfile,
    goToDashboard,
    goTo,
  }
})
