import type React from 'react'
import { useLayoutEffect, useState } from 'react'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/constants/theme'
import { THEMES } from '@/types/theme'
import type { Theme, ThemeContextType } from '@/types/theme'
import { faviconManager } from '@/utils/faviconManager'
import { ThemeContext } from './themeContext'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider = ({
  children
}: ThemeProviderProps): React.JSX.Element => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === THEMES.LIGHT || stored === THEMES.DARK) {
        return stored
      }

      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      return prefersDark ? THEMES.DARK : THEMES.LIGHT
    }
    return DEFAULT_THEME
  })

  useLayoutEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.style.colorScheme = theme

    const metaThemeColor = document.querySelector('meta[name="color-scheme"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'color-scheme'
      meta.content = theme
      document.head.appendChild(meta)
    }

    faviconManager.setFaviconForTheme(theme === THEMES.DARK)
  }, [theme])

  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const toggleTheme = (): void => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    setTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
