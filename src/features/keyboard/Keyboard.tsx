import { useKeyboardMap } from '@/hooks/useKeyboardMap'
import { useEffect, useRef, useState } from 'react'
import { LightKey, DarkKey } from './KeyboardKey'
import { KeyboardControls } from './KeyboardControls'
import { getContext } from 'tone'
import { useSynthesizer } from '@/hooks/useSynthesizer'
import { Synthesizer } from '../core/Synthesizer'
import { KEYBOARD_LAYOUT } from '@/lib/constants'

export function Keyboard() {
  const synth = useSynthesizer()
  return <KeyboardInternal synth={synth} />
}

function KeyboardInternal({
  synth,
}: {
  synth: React.MutableRefObject<Synthesizer | undefined>
}) {
  const { pressKey, releaseKey, getActiveNotes } =
    useKeyboardMap(KEYBOARD_LAYOUT)

  const [visualNotes, setVisualNotes] = useState<string[]>([])
  const activeNotes = useRef(new Set<string>()).current
  const keyboardKeys = Object.entries(KEYBOARD_LAYOUT)

  const lightKeys = keyboardKeys.filter(([, note]) => !note.includes('#'))
  const darkKeys = keyboardKeys.filter(([, note]) => note.includes('#'))

  const getDarkKeyPosition = (note: string) => {
    const width = 100 / lightKeys.length
    const index = lightKeys.findIndex(([, n]) => n === note.replace('#', ''))
    return `calc(${width * index}% + ${width / 2}%)`
  }

  useEffect(() => {
    function keyDown(e: KeyboardEvent) {
      const note = pressKey(e.key)
      if (note && !activeNotes.has(note)) {
        activeNotes.add(note)
        synth.current?.triggerAttack(note, (getContext().lookAhead = 0))
        setVisualNotes(getActiveNotes())
      }
    }
    function keyUp(e: KeyboardEvent) {
      const note = releaseKey(e.key)
      if (note && activeNotes.has(note)) {
        activeNotes.delete(note)
        synth.current?.triggerRelease(note, '+0.1')
        setVisualNotes(getActiveNotes())
      }
    }

    document.addEventListener('keydown', keyDown, { passive: true })
    document.addEventListener('keyup', keyUp, { passive: true })

    return () => {
      document.removeEventListener('keydown', keyDown)
      document.removeEventListener('keyup', keyUp)
    }
  }, [activeNotes, getActiveNotes, synth, pressKey, releaseKey])

  return (
    <article className='flex items-center w-full max-w-5xl p-2 px-8 border rounded-md select-none border-left bg-card'>
      <div className='w-full mx-auto space-y-4'>
        <div className='flex justify-center min-h-12'>
          <KeyboardControls />
        </div>
        <div className='relative max-w-3xl mx-auto overflow-hidden rounded-lg shadow-inner min-h-60'>
          <div className='absolute inset-0 flex'>
            {lightKeys.map(([key, note]) => (
              <LightKey
                key={note}
                musicalNote={note}
                mappedKey={key}
                isKeyActive={visualNotes.includes(note)}
              />
            ))}
          </div>
          <div className='absolute inset-0 left-1.5 pointer-events-none'>
            {darkKeys.map(([key, note]) => (
              <DarkKey
                key={note}
                musicalNote={note}
                mappedKey={key}
                leftPosition={getDarkKeyPosition(note)}
                isKeyActive={visualNotes.includes(note)}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
