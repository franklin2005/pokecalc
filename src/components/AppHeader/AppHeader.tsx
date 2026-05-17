/**
 * PokeCalc — AppHeader Component
 * Simple header with logo and dark mode toggle.
 */

import './AppHeader.css'
import lunatoneIcon from '../../assets/lunatone-icon.png'
import solrockIcon from '../../assets/solrock-icon.png'

interface AppHeaderProps {
  isDark: boolean
  onToggleTheme: () => void
}

export function AppHeader({ isDark, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__logo">
        <span className="material-symbols-outlined app-header__icon">calculate</span>
        <h1 className="app-header__title">PokeCalc</h1>
      </div>
      <button
        className="app-header__theme-btn"
        type="button"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <img
          className={`app-header__theme-icon ${isDark ? 'app-header__theme-icon--solrock' : ''}`}
          src={isDark ? solrockIcon : lunatoneIcon}
          alt={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        />
      </button>
    </header>
  )
}
