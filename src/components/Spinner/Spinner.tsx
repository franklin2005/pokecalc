/**
 * PokeCalc — Spinner Component
 * Simple rotating loading indicator with optional text label.
 */

import './Spinner.css'

interface SpinnerProps {
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export function Spinner({ text, size = 'medium' }: SpinnerProps) {
  return (
    <div className="spinner">
      <div className={`spinner__circle spinner__circle--${size}`} />
      {text && <span className="spinner__text">{text}</span>}
    </div>
  )
}
