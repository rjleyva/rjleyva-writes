import type React from 'react'
import { forwardRef, memo } from 'react'
import type { IconProps } from '@/types/icons'

const MoonIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(
    (
      {
        size = 24,
        ariaLabel = 'Moon Icon',
        title = 'Switch to Dark Mode',
        ...props
      },
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
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label={ariaLabel}
          role="img"
          {...props}
        >
          <title>{title}</title>
          <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
        </svg>
      )
    }
  )
)

export default MoonIcon
