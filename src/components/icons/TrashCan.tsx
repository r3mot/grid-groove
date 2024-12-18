import * as React from 'react'
export const TrashCanIcon = ({
  height = '1em',
  strokeWidth = '32',
  focusable = 'false',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'>) => (
  <svg
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 512 512'
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      d='m112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320'
    />
    <path
      fill='currentColor'
      stroke='currentColor'
      strokeLinecap='round'
      strokeMiterlimit='10'
      strokeWidth={strokeWidth}
      d='M80 112h352'
    />
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      d='M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40m-64 64v224m-72-224l8 224m136-224l-8 224'
    />
  </svg>
)
