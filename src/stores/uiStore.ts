import { DisplayMode } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { legacySequencerState as legacy } from './utils/legacySequencerState'

interface UIState {
  displayMode: DisplayMode
  isClearWarningRead: boolean

  setDisplayMode: (displayMode: DisplayMode) => void
  setClearWarningRead: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      set => ({
        displayMode: legacy.displayMode ?? 'step',
        isClearWarningRead: legacy.isClearWarningRead ?? false,

        setDisplayMode: displayMode => set({ displayMode }),
        setClearWarningRead: () => set({ isClearWarningRead: true }),
      }),
      { name: 'ui-store' },
    ),
  ),
)
