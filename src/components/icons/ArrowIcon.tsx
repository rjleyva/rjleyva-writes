import type React from 'react'
import { forwardRef, memo } from 'react'
import type { IconProps } from '@/types/icons'

const ArrowIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(
    (
      { size = 24, ariaLabel = 'Arrow Icon', title = 'Arrow', ...props },
      ref
    ): React.JSX.Element => {
      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label={ariaLabel}
          role="img"
          {...props}
        >
          <title>{title}</title>
          <path d="M5 12h14m0 0-5-5m5 5-5 5" />
        </svg>
      )
    }
  )
)

export default ArrowIcon
