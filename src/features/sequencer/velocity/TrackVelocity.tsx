import { cn } from '@/lib/utils'
import { usePatternStore } from '@/stores/patternStore'
import { DisplayColor } from '@/types'
import { useEffect, useRef, useState } from 'react'

interface TrackVelocityProps {
  row: number
  column: number
  displayColor: DisplayColor
}

export function TrackVelocity({
  row,
  column,
  displayColor,
}: TrackVelocityProps) {
  const activeStep = usePatternStore(state => state.steps[row]?.[column])
  const storedVelocity = usePatternStore(
    state => state.velocities[row]?.[column] ?? 1,
  )
  const group = column % 8 < 4 ? 'even' : 'odd'
  const [velocity, setVelocity] = useState(activeStep ? storedVelocity : 0)

  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)

  function handleDrag(e: MouseEvent) {
    if (!dragRef.current || !activeStep) return
    const { top, height } = dragRef.current.getBoundingClientRect()
    const velocity = Math.min(
      Math.max((height - (e.clientY - top)) / height, 0),
      1,
    )

    setVelocity(velocity)
    usePatternStore.getState().setVelocity(row, column, velocity)
  }

  const stopDrag = () => {
    setIsDragging(false)
    window.removeEventListener('mousemove', handleDrag)
    window.removeEventListener('mouseup', stopDrag)
  }

  const startDrag = () => {
    setIsDragging(true)
    window.addEventListener('mousemove', handleDrag)
    window.addEventListener('mouseup', stopDrag)
  }

  useEffect(() => {
    if (activeStep) {
      setVelocity(storedVelocity)
    }
  }, [activeStep, storedVelocity])

  return (
    <button
      data-group={group}
      style={
        {
          '--track-color': displayColor,
        } as React.CSSProperties
      }
      className={cn(
        'velocity w-full h-full border relative overflow-hidden hover:border-red-500',
        "data-[group='odd']:bg-accent/60 bg-muted/20 rounded-[2px]",
        'cursor-grab focus:cursor-grabbing select-none',
        activeStep && 'bg-(--velocity-bg)',
      )}
    >
      <div
        aria-disabled={!activeStep}
        ref={dragRef}
        className={cn('relative w-full h-full overflow-hidden')}
        onMouseDown={startDrag}
      >
        <div
          className={cn('absolute bottom-0 z-10 w-full', {
            'border-t bg-(--velocity-fill)': activeStep,
          })}
          style={{
            height: `${velocity * 100}%`,
          }}
        />
      </div>
      {isDragging && (
        <span className='absolute bottom-0 z-10 text-xs text-white -translate-x-1/2 select-none left-1/2'>
          {(velocity * 100).toFixed(0)}%
        </span>
      )}
    </button>
  )
}
