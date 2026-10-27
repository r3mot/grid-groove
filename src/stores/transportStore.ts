import { PlaybackState } from 'tone'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { legacySequencerState as legacy } from './utils/legacySequencerState'

interface TransportState {
  playbackState: PlaybackState
  bpm: number

  setPlaybackState: (playbackState: PlaybackState) => void
  togglePlayback: () => void
  setBpm: (bpm: number) => void
}

/**
 * audio engine subscribes to this store and
 * drives the Tone transport to match.
 */
export const useTransportStore = create<TransportState>()(
  devtools(
    persist(
      set => ({
        playbackState: 'stopped',
        bpm: legacy.playbackBPM ?? 120,

        setPlaybackState: playbackState => set({ playbackState }),

        togglePlayback: () =>
          set(state => ({
            playbackState:
              state.playbackState === 'started' ? 'stopped' : 'started',
          })),

        setBpm: bpm => set({ bpm }),
      }),
      {
        name: 'transport-store',
        version: 0,
        partialize: state => ({ bpm: state.bpm }),
      },
    ),
  ),
)
