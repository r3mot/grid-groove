import { KEYBOARD_LAYOUT } from '@/lib/constants'

import { useCallback, useState } from 'react'

const keys = Object.entries(KEYBOARD_LAYOUT)
const darkKeys = keys.filter(([, note]) => note.includes('#'))
const lightKeys = keys.filter(([, note]) => !note.includes('#'))

export function useAudioKeys() {
  const keyMap: { [key: string]: string } = KEYBOARD_LAYOUT
  const [activeKeys, setActiveKeys] = useState(new Set<string>())

  const pressKey = useCallback(
    (key: string) => {
      const note = keyMap[key]
      if (note && !activeKeys.has(note)) {
        const set = new Set(activeKeys)
        set.add(note)
        setActiveKeys(set)
        return note
      }
    },
    [activeKeys, keyMap],
  )

  const releaseKey = useCallback(
    (key: string) => {
      const note = keyMap[key]
      if (note && activeKeys.has(note)) {
        const set = new Set(activeKeys)
        set.delete(note)
        setActiveKeys(set)
        return note
      }
    },
    [activeKeys, keyMap],
  )

  const getActiveNotes = Array.from(activeKeys)

  return {
    pressKey,
    releaseKey,
    getActiveNotes,
    activeKeys,
    keys: {
      darkKeys,
      lightKeys,
    },
  }
}
