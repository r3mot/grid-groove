import { DisplayMode, StepCount, Subdivision } from '@/types'

/**
 * State persisted by the old monolithic `sequencer-store`. The split stores
 * seed their defaults from it so existing beats and settings survive the move
 * to their own storage keys.
 */
export interface LegacySequencerState {
  stepCount?: StepCount
  subdivision?: Subdivision
  displayMode?: DisplayMode
  steps?: boolean[][]
  velocities?: number[][]
  isClearWarningRead?: boolean
  playbackBPM?: number
}

export const LEGACY_SEQUENCER_KEY = 'sequencer-store'

function readLegacySequencerState(): LegacySequencerState {
  try {
    const raw = localStorage.getItem(LEGACY_SEQUENCER_KEY)
    return raw ? (JSON.parse(raw).state ?? {}) : {}
  } catch {
    return {}
  }
}

export const legacySequencerState = readLegacySequencerState()
