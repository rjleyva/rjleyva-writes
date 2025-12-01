import type React from 'react'
import { forwardRef, memo } from 'react'
import type { IconProps } from '@/types/icons'

const CheckIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(
    (
      { size = 24, ariaLabel = 'Check Icon', title = 'Success', ...props },
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label={ariaLabel}
          role="img"
          {...props}
        >
          <title>{title}</title>
          <polyline points="20,6 9,17 4,12" />
        </svg>
      )
    }
  )
)

export default CheckIcon
