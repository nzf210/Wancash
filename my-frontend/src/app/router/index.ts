import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// otomatis import route dari masing2 modul
const modules = import.meta.glob('@/modules/**/index.ts', { eager: true })

const routes: RouteRecordRaw[] = []
for (const path in modules) {
  // setiap index.ts di modul harus export default RouteRecordRaw[]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const mod = modules[path].default
  if (Array.isArray(mod)) routes.push(...mod)
}

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
