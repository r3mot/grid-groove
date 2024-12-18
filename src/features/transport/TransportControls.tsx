import { useTransport } from '@/hooks/useTransport'
import { PauseIcon, PlayIcon, SquareIcon } from 'lucide-react'
import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

export function TransportControls() {
  const { start, stop, pause, canPlay, isPlaying } = useTransport()

  const styles = toggleVariants({ variant: 'default' })

  return (
    <div className='flex items-center justify-center gap-2'>
      <>
        {isPlaying && (
          <button onClick={pause} className={cn(styles)}>
            <PauseIcon fill='currentColor' />
          </button>
        )}
        {canPlay && (
          <button onClick={start} className={cn(styles)}>
            <PlayIcon fill='currentColor' />
          </button>
        )}
      </>
      <button onClick={stop} className={cn(styles)}>
        <SquareIcon fill='currentColor' />
      </button>

      {/* <ClearSteps /> */}
    </div>
  )
}
