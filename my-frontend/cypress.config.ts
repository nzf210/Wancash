import { defineConfig } from 'cypress'
import { startDevServer } from '@cypress/vite-dev-server'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
  },
  component: {
    specPattern: 'src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
    devServer: async (cypressConfig) => {
      const { default: viteConfig } = await import('./vite.config')
      const resolvedViteConfig =
        typeof viteConfig === 'function' ? viteConfig({ mode: 'development' }) : viteConfig
      return startDevServer({
        options: cypressConfig,
        viteConfig: resolvedViteConfig,
      })
    },
  },
})
