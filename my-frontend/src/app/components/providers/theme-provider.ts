import { provide, inject, type InjectionKey, type Ref, computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'

type Theme = 'light' | 'dark' | 'system'
type ThemeContext = {
  theme: Ref<Theme>
  setTheme: (theme: Theme) => void
  resolvedTheme: Ref<'light' | 'dark'>
}

const ThemeProviderSymbol = Symbol() as InjectionKey<ThemeContext>

export function provideTheme() {
  const theme = useStorage<Theme>('theme', 'system')
  const resolvedTheme = computed(() => {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme.value
  })

  watch(resolvedTheme, (newTheme) => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
  }, { immediate: true })

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  provide(ThemeProviderSymbol, {
    theme,
    setTheme,
    resolvedTheme
  })
}

export function useTheme() {
  const context = inject(ThemeProviderSymbol)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
