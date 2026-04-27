import { useTheme as useNextTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  return {
    theme,
    setTheme,
    resolvedTheme,
    mounted,
    isDark: resolvedTheme === 'dark',
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }
}
