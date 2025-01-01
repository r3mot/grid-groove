import { clamp } from '@/lib/math'
import { cn } from '@/lib/utils'
import { useSequenceStore } from '@/providers/store/sequenceStore'
import { useCallback, useEffect, useState } from 'react'

export function TransportBPM() {
  const [isDragging, setIsDragging] = useState(false)

  const playbackBpm = useSequenceStore(state => state.playbackBPM)
  const setBPM = useSequenceStore(state => state.setPlaybackBPM)

  const updateBPM = useCallback((bpm: number) => setBPM(bpm), [setBPM])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const sensitivity = 0.1
      const dy = e.movementY * sensitivity
      updateBPM(clamp(playbackBpm - dy, 20, 999))
    }

    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, playbackBpm, updateBPM])

  return (
    <div
      onMouseDown={() => setIsDragging(true)}
      className={cn(
        'shadow-[inset_0px_3px_6px_0px_rgba(0,_0,_0,_0.7)]',
        'cursor-row-resize bg-background/90 border rounded-md h-10 select-none',
        'hidden xl:inline-flex items-center',
      )}
    >
      <div className='flex items-baseline justify-between px-4'>
        <span className='mr-2 text-xs'>BPM</span>
        <span className='text-base tabular-nums'>
          {playbackBpm.toFixed(0).toString().padStart(3, '0')}
        </span>
      </div>
    </div>
  )
}
