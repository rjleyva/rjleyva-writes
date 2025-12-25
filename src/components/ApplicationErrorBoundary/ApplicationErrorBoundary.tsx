import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import styles from '@/styles/error-boundary.module.css'
import { env } from '@/utils/config'
import { createLogger } from '@/utils/logger'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ApplicationErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const logger = createLogger('ApplicationErrorBoundary')
    logger.error('Error caught by ErrorBoundary', { error, errorInfo })
  }

  private attemptRecovery = (): void => {
    this.setState({ hasError: false })
  }

  private handleRefresh = (): void => {
    window.location.reload()
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback != null) {
        return this.props.fallback
      }

      return (
        <div className={styles['error-boundary']}>
          <div className={styles['error-boundary__content']}>
            <h1
              className={`${styles['error-boundary__title']} title-large-gradient`}
            >
              The application encountered an unexpected error
            </h1>
            <p className={styles['error-boundary__message']}>
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            <div className={styles['error-boundary__actions']}>
              <button
                type="button"
                onClick={this.attemptRecovery}
                className={`${styles['error-boundary__button']} ${styles['error-boundary__button--secondary']}`}
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleRefresh}
                className={`${styles['error-boundary__button']} ${styles['error-boundary__button--primary']}`}
              >
                Refresh Page
              </button>
            </div>
            {env.isDevelopment && this.state.error && (
              <details className={styles['error-boundary__details']}>
                <summary className={styles['error-boundary__summary']}>
                  Error Details (Development Only)
                </summary>
                <pre className={styles['error-boundary__error']}>
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
