import * as React from 'react'

export const SpeakerOffIcon = ({
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
      d='M7.557 2.066A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.248.56L3.59 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.59l3.162-2.81a.75.75 0 0 1 .805-.124M11.28 5.72a.75.75 0 1 0-1.06 1.06L11.44 8l-1.22 1.22a.75.75 0 1 0 1.06 1.06l1.22-1.22l1.22 1.22a.75.75 0 1 0 1.06-1.06L13.56 8l1.22-1.22a.75.75 0 0 0-1.06-1.06L12.5 6.94z'
    />
  </svg>
)
