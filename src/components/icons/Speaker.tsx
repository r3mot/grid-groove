import * as React from 'react'

export const SpeakerIcon = ({
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
      d='M7.557 2.066A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.248.56L3.59 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.59l3.162-2.81a.75.75 0 0 1 .805-.124m5.393.984a.75.75 0 1 0-1.06 1.06a5.5 5.5 0 0 1 0 7.78a.75.75 0 1 0 1.06 1.06a7 7 0 0 0 0-9.9'
    />
    <path
      fill={fill}
      d='M10.828 5.172a.75.75 0 1 0-1.06 1.06a2.5 2.5 0 0 1 0 3.536a.75.75 0 1 0 1.06 1.06a4 4 0 0 0 0-5.656'
    />
  </svg>
)
