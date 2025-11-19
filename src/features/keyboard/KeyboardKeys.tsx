import { cn } from '@/lib/utils'
import { Synthesizer } from '../core/Synthesizer'
import React, { useCallback, useEffect } from 'react'
import { useAudioKeys } from '@/hooks/useAudioKeys'
import { getContext } from 'tone'

interface KeyboardKeysProps {
  synth: React.MutableRefObject<Synthesizer | undefined>
}

const getDarkKeyPosition = (note: string, lightKeys: [string, string][]) => {
  const width = 100 / lightKeys.length
  const index = lightKeys.findIndex(([, n]) => n === note.replace('#', ''))
  return `calc(${width * index}% + ${width / 2}%)`
}

export function KeyboardKeys({ synth }: KeyboardKeysProps) {
  const { pressKey, releaseKey, activeKeys, keys } = useAudioKeys()

  const triggerNote = useCallback(
    (note: string) => {
      synth.current?.triggerAttack(note, (getContext().lookAhead = 0))
    },
    [synth],
  )

  const releaseNote = useCallback(
    (note: string) => {
      synth.current?.triggerRelease(note, '+0.1')
    },
    [synth],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const note = pressKey(e.key)
      if (note) triggerNote(note)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = releaseKey(e.key)
      if (note) releaseNote(note)
    }

    document.addEventListener('keydown', handleKeyDown, { passive: true })
    document.addEventListener('keyup', handleKeyUp, { passive: true })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [pressKey, releaseKey, triggerNote, releaseNote])

  return (
    <div className='relative max-w-3xl mx-auto overflow-hidden rounded-lg shadow-inner min-h-60'>
      <div className='absolute inset-0 flex'>
        {keys.lightKeys.map(([key, note]) => (
          <button
            key={key}
            aria-pressed={activeKeys.has(note)}
            aria-label={`Light key for note ${note} mapped to ${key}`}
            className={cn(
              'flex-1 border-r last:border-r-0 rounded-b-md flex flex-col justify-end items-center pb-2',
              'bg-stone-100 text-foreground transition-all duration-200 ease-in-out',
              activeKeys.has(note)
                ? 'bg-stone-400'
                : 'shadow-md hover:bg-stone-400',
            )}
            onMouseDown={() => triggerNote(note)}
            onMouseUp={() => releaseNote(note)}
            onMouseLeave={() => releaseNote(note)}
          >
            <span className='text-xs font-semibold text-black'>{note}</span>
            <span className='text-xs text-black'>({key})</span>
          </button>
        ))}
      </div>

      <div className='absolute inset-0 left-1.5 pointer-events-none'>
        {keys.darkKeys.map(([key, note]) => (
          <button
            key={key}
            aria-pressed={activeKeys.has(note)}
            aria-label={`Dark key for note ${note} mapped to ${key}`}
            className={cn(
              'pointer-events-auto bg-black absolute w-[8%] h-3/5 rounded-b-md flex flex-col justify-end items-center pb-2 z-10 transition-all',
              activeKeys.has(note) ? 'bg-stone-900' : 'hover:bg-stone-900',
            )}
            style={{ left: getDarkKeyPosition(note, keys.lightKeys) }}
            onMouseDown={() => triggerNote(note)}
            onMouseUp={() => releaseNote(note)}
            onMouseLeave={() => releaseNote(note)}
          >
            <span className='text-xs font-semibold text-white'>{note}</span>
            <span className='text-xs text-gray-400'>({key})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
