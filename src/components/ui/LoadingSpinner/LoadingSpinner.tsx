import type React from 'react'
import styles from './loading-spinner.module.css'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

const LoadingSpinner = ({
  size = 'medium',
  text = 'Loading...'
}: SpinnerProps): React.JSX.Element => {
  return (
    <div className={styles['loading']}>
      <div
        className={`${styles['loading__spinner']} ${styles[`loading__spinner--${size}`]}`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className={styles['loading__spinner-text']}>{text}</p>}
    </div>
  )
}

export default LoadingSpinner
