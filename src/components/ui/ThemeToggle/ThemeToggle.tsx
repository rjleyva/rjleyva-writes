import type React from 'react'
import { useTheme } from '@/hooks/useTheme'
import { THEMES } from '@/types/theme'
import MoonIcon from '../../icons/MoonIcon'
import SunIcon from '../../icons/SunIcon'
import styles from './theme-toggle.module.css'

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle = ({
  className
}: ThemeToggleProps): React.JSX.Element => {
  const { theme, toggleTheme } = useTheme()

  const handleToggle = (): void => {
    toggleTheme()
  }

  const isDark = theme === THEMES.DARK

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`${styles['theme-toggle']} interactive-element ${className ?? ''}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={`${styles['theme-toggle__icon']} flex-center`}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  )
}
