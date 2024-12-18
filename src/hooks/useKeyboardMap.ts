import { KeyboardContext } from '@/providers/context/KeyboardContext'
import { useCallback, useContext } from 'react'

export function useKeyboardMap(keyToNote: Record<string, string>) {
  const { activeNotes } = useContext(KeyboardContext)

  const pressKey = useCallback(
    (key: string): string | null => {
      const note = keyToNote[key]
      if (note && !activeNotes.has(note)) {
        activeNotes.add(note)
        return note
      }
      return null
    },
    [activeNotes, keyToNote],
  )

  const releaseKey = useCallback(
    (key: string): string | null => {
      const note = keyToNote[key]
      if (note && activeNotes.has(note)) {
        activeNotes.delete(note)
        return note
      }
      return null
    },
    [activeNotes, keyToNote],
  )

  const getActiveNotes = useCallback(() => {
    return Array.from(activeNotes)
  }, [activeNotes])

  return {
    pressKey,
    releaseKey,
    getActiveNotes,
    activeNotes,
  }
}
