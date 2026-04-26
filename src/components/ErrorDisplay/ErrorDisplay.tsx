/**
 * PokeCalc — ErrorDisplay Component
 * Inline DOM error message with optional retry button.
 * Uses BEM methodology and design system CSS variables.
 */

import './ErrorDisplay.css'

interface ErrorDisplayProps {
  /** The error message to display */
  message: string
  /** Optional retry callback */
  onRetry?: () => void
  /** 'inline' = compact, 'banner' = full-width notice */
  variant?: 'inline' | 'banner'
}

export function ErrorDisplay({ message, onRetry, variant = 'inline' }: ErrorDisplayProps) {
  const blockClass = `error-display error-display--${variant}`

  return (
    <div className={blockClass} role="alert" aria-live="polite">
      <span className="material-symbols-outlined error-display__icon" aria-hidden="true">
        error
      </span>
      <div className="error-display__content">
        <p className="error-display__message">{message}</p>
        {onRetry && (
          <button
            className="error-display__retry"
            type="button"
            onClick={onRetry}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}
