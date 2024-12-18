import * as React from 'react'

export const LockedIcon = ({
  height = '1em',
  fill = 'currentColor',
  focusable = 'false',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'>) => (
  <svg
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      fillRule='evenodd'
      d='M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1m2 6V4.5a2 2 0 1 0-4 0V7z'
      clipRule='evenodd'
    />
  </svg>
)
