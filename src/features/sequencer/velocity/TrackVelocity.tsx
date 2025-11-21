import { cn } from '@/lib/utils'
import { useSequenceStore } from '@/stores/sequenceStore'
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
  const steps = useSequenceStore(state => state.steps)
  const velocities = useSequenceStore(state => state.velocities)
  const activeStep = steps[row][column]
  const group = column % 8 < 4 ? 'even' : 'odd'
  const [velocity, setVelocity] = useState(
    activeStep ? velocities[row][column] : 0,
  )

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
    useSequenceStore.getState().updateVelocity(velocity, column, row)
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
      setVelocity(velocities[row][column])
    }
  }, [activeStep, velocities, row, column])

  return (
    <button
      data-group={group}
      style={{
        backgroundColor: activeStep ? displayColor : '',
      }}
      className={cn(
        'w-full h-full border relative overflow-hidden hover:border-red-500',
        "data-[group='odd']:bg-accent/60 bg-muted/20 rounded-[2px]",
        'cursor-grab focus:cursor-grabbing select-none',
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
            'border-t': activeStep,
          })}
          style={{
            height: `${velocity * 100}%`,
            backgroundColor: activeStep ? displayColor : '',
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
