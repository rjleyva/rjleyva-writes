import type React from 'react'
import { forwardRef, memo } from 'react'
import type { IconProps } from '@/types/icons'

const InstagramIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(
    (
      {
        size = 24,
        ariaLabel = 'Instagram Icon',
        title = "Visit RJ Leyva's Instagram Profile",
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
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      )
    }
  )
)

export default InstagramIcon
