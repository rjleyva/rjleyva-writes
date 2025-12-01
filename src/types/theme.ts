export type Theme = 'light' | 'dark'

export type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const THEMES = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const
} as const
