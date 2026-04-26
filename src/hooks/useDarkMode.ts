/**
 * PokeCalc — useDarkMode Hook
 * Toggle between light/dark theme with localStorage persistence.
 */

import { useState, useEffect, useCallback } from 'react'

const THEME_KEY = 'theme'
const DARK_VALUE = 'dark'
const LIGHT_VALUE = 'light'

function getInitialTheme(): string {
  // Check localStorage first
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === DARK_VALUE || stored === LIGHT_VALUE) {
    return stored
  }

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK_VALUE
  }

  return LIGHT_VALUE
}

export function useDarkMode(): [isDark: boolean, toggle: () => void] {
  const [theme, setTheme] = useState<string>(getInitialTheme)

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === DARK_VALUE ? LIGHT_VALUE : DARK_VALUE))
  }, [])

  const isDark = theme === DARK_VALUE

  return [isDark, toggle]
}
