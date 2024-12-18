import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex flex-col w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative w-2 h-full overflow-hidden border rounded-full grow bg-background/60 border-border/80'>
      <SliderPrimitive.Range className='absolute inset-0 h-full' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      data-testid='react-slider-thumb'
      className='block transition-colors rotate-90 fader-thumb border-primary bg-background ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
