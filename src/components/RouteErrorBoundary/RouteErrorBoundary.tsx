import type React from 'react'
import { useNavigate, useRouteError } from 'react-router'
import styles from './route-error-boundary.module.css'

const RouteErrorBoundary = (): React.JSX.Element => {
  const error = useRouteError() as Error
  const navigate = useNavigate()

  const handleTryAgain = (): void => {
    navigate(0)
  }

  const handleRefresh = (): void => {
    window.location.reload()
  }

  return (
    <div className={styles['error-boundary']}>
      <div className={styles['error-boundary__content']}>
        <h1
          className={`${styles['error-boundary__title']} title-large-gradient`}
        >
          This page encountered an unexpected error
        </h1>
        <p className={styles['error-boundary__message']}>
          We encountered an unexpected error while loading this page. Please try
          again or refresh the page.
        </p>
        <div className={styles['error-boundary__actions']}>
          <button
            type="button"
            onClick={handleTryAgain}
            className={`${styles['error-boundary__button']} ${styles['error-boundary__button--secondary']}`}
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className={`${styles['error-boundary__button']} ${styles['error-boundary__button--primary']}`}
          >
            Refresh Page
          </button>
        </div>
        {import.meta.env.MODE === 'development' && (
          <details className={styles['error-boundary__details']}>
            <summary className={styles['error-boundary__summary']}>
              Error Details (Development Only)
            </summary>
            <pre className={styles['error-boundary__error']}>
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default RouteErrorBoundary
