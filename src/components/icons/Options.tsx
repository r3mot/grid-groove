import * as React from 'react'

export const OptionsIcon = ({
  height = '1em',
  strokeWidth = '32',
  fill = 'none',
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
      fill={fill}
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      d='M368 128h80m-384 0h240m64 256h80m-384 0h240m-96-128h240m-384 0h80'
    />
    <circle
      cx='336'
      cy='128'
      r='32'
      fill={fill}
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
    />
    <circle
      cx='176'
      cy='256'
      r='32'
      fill={fill}
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
    />
    <circle
      cx='336'
      cy='384'
      r='32'
      fill={fill}
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
    />
  </svg>
)
