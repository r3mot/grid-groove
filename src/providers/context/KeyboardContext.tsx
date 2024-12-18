import { createContext } from 'react'
import { PolySynth } from 'tone'

interface KeyboardContextProps {
  polySynthRef: React.MutableRefObject<PolySynth | undefined>
  keyMap: Record<string, string>
  activeNotes: Set<string>
}

export const KeyboardContext = createContext({} as KeyboardContextProps)
