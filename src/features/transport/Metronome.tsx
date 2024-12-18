import { MetronomeIcon } from '@/components/icons/Metronome'
import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { useSequenceStore } from '@/providers/store/sequenceStore'
import { useEffect, useRef, useState } from 'react'
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

  const playbackBPM = useSequenceStore(state => state.playbackBPM)

  useEffect(() => {
    synth.current = new Synth(synthOptions).toDestination()

    loop.current = new Loop(time => {
      const transport = getTransport()
      const elapsedSeconds = transport.seconds
      const beatDuration = 60 / playbackBPM
      const beatPosition = Math.floor(elapsedSeconds / beatDuration) % 4

      const note = beatPosition === 0 ? 'C6' : 'C5'
      synth.current?.triggerAttackRelease(note, '16n', time)
    }, '4n')

    return () => {
      synth.current?.dispose()
      loop.current?.dispose()
    }
  }, [playbackBPM])

  const toggleMetronome = () => {
    if (isPlaying) {
      loop.current?.stop()
    } else {
      loop.current?.start(0)
    }
    setIsPlaying(prev => !prev)
  }

  useEffect(() => {
    if (isPlaying && loop.current) {
      loop.current.interval = `${60 / playbackBPM}s` // Adjust interval on BPM change
    }
  }, [playbackBPM, isPlaying])

  return (
    <button
      className={cn(
        toggleVariants({ variant: 'default' }),
        isPlaying && 'bg-blue-600 hover:bg-blue-700',
      )}
      onClick={toggleMetronome}
    >
      <MetronomeIcon />
      <span className='sr-only'>Toggle Metronome</span>
    </button>
  )
}
