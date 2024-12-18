import { MetronomeIcon } from '@/components/icons/Metronome'
import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getTransport, Loop, Synth, SynthOptions } from 'tone'
import { RecursivePartial } from 'tone/build/esm/core/util/Interface'

const synthOptions: RecursivePartial<SynthOptions> = {
  volume: -12,
  oscillator: {
    type: 'triangle',
  },
  envelope: {
    attack: 0.01,
    decay: 0.05,
    sustain: 0.0,
    release: 1,
  },
}

export function Metronome() {
  const synth = useRef<Synth | null>(null)
  const loop = useRef<Loop | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    synth.current = new Synth(synthOptions).toDestination()

    loop.current = new Loop(time => {
      const transport = getTransport()
      transport.setLoopPoints(0, '1m')
      const step = Number(transport.position.toString().split(':')[1])
      const note = step === 0 ? 'C6' : 'C5'
      synth.current?.triggerAttackRelease(note, '16n', time)
    })

    return () => {
      synth.current?.dispose()
      loop.current?.dispose()
    }
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      loop.current?.stop()
    } else {
      loop.current?.start()
    }
    setIsPlaying(prev => !prev)
  }, [isPlaying])

  return (
    <button
      className={cn(
        toggleVariants({ variant: 'default' }),
        isPlaying && 'bg-blue-600 hover:bg-blue-700',
      )}
      onClick={toggle}
    >
      <MetronomeIcon />
      <span className='sr-only'>Toggle Metronome</span>
    </button>
  )
}
