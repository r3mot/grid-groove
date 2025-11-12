import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { clamp, valueToAngle } from '@/lib/math'

const knobVariants = cva('relative w-full h-full rounded-full', {
  variants: {
    color: {
      default: 'bg-stone-500',
      secondary: 'bg-secondary',
      primary: 'bg-primary',
    },
  },
  defaultVariants: {
    color: 'default',
  },
})

const trackVariants = cva('rounded-full bg-background shrink-0', {
  variants: {
    size: {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    },
    color: {
      default: 'bg-stone-500',
      secondary: 'bg-secondary',
      primary: 'bg-primary',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
})

interface RotaryKnobProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof trackVariants> {
  minValue: number
  maxValue: number
  initialValue: number
  onValueChange: (value: number) => void
}

export function RotaryKnob({
  minValue,
  maxValue,
  initialValue = 0,
  size = 'sm',
  color = 'default',
  className,
  onValueChange,
  ...props
}: RotaryKnobProps) {
  const [value, setValue] = useState(initialValue)
  const initialMouseY = useRef(0)
  const initialValueRef = useRef(initialValue)
  const isMouseDragging = useRef(false)

  const rotation = valueToAngle(value, minValue, maxValue)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      isMouseDragging.current = true
      initialMouseY.current = e.clientY
      initialValueRef.current = value
      document.body.classList.add('select-none')
    },
    [value],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDragging.current) return

      const dragDistance = initialMouseY.current - e.clientY
      const dragToValue = (dragDistance / 100) * (maxValue - minValue)
      const normalizedValue = clamp(
        initialValueRef.current + dragToValue,
        minValue,
        maxValue,
      )

      setValue(normalizedValue)
      onValueChange(normalizedValue)
    },
    [minValue, maxValue, onValueChange],
  )

  const handleMouseUp = useCallback(() => {
    isMouseDragging.current = false
    document.body.classList.remove('select-none')
  }, [])

  const rotationGradient =
    rotation >= 0
      ? `conic-gradient(rgb(74,222,128) 0deg ${rotation}deg, transparent ${rotation}deg 360deg)`
      : `conic-gradient(transparent 0deg ${
          360 + rotation
        }deg, rgb(74,222,128) ${360 + rotation}deg 360deg)`

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      {...props}
      style={{ background: rotationGradient }}
      className={cn(trackVariants({ size, color }), className)}
    >
      <div className='w-full h-full p-1 rounded-full bg-inherit'>
        <div
          role='button'
          className={cn(knobVariants({ color }))}
          style={{ transform: `rotate(${rotation}deg)` }}
          onMouseDown={handleMouseDown}
        >
          <div className='absolute top-px w-0.5 h-2 bg-black left-1/2'></div>
        </div>
      </div>
    </div>
  )
}
