import { EffectBus } from '@/features/core/EffectBus'
import { MainBus } from '@/features/core/MainBus'
import { Sampler } from '@/features/core/Sampler'
import { adjustArraySize } from '@/lib/utils'
import {
  DisplayColor,
  DisplayMode,
  Sample,
  StepCount,
  Subdivision,
} from '@/types'
import { PlaybackState, Sequence, getTransport } from 'tone'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useSampleStore } from './sampleStore'

interface SequencerState {
  playbackState: PlaybackState
  playbackBPM: number
  isPlaying: boolean

  stepCount: StepCount
  subdivision: Subdivision
  displayMode: DisplayMode

  steps: boolean[][]
  velocities: number[][]

  mainBus: MainBus | null
  effectBus: EffectBus | null
  samplers: Sampler[]
  sequence: Sequence | null

  isSequenceInitialized: boolean
  soloChannelIds: Set<string>
  isClearWarningRead: boolean

  setPlaybackState: (state: PlaybackState) => void
  setPlaybackBPM: (bpm: number) => void
  togglePlayback: () => void

  setStepCount: (stepCount: StepCount) => void
  setSubdivision: (subdivision: Subdivision) => void
  setDisplayMode: (displayMode: DisplayMode) => void
  updateStep: (step: number, sample: number, active: boolean) => void
  updateVelocity: (velocity: number, sample: number, step: number) => void
  updateSamplerColor: (sampleId: string, color: DisplayColor) => void
  clearSteps: () => void
  clearStepRow: (row: number) => void

  toggleSoloChannel: (channelId: string) => void
  updateSoloStates: () => void

  setClearWarningRead: () => void

  initialize: () => Promise<void>
}

export const useSequenceStore = create<SequencerState>()(
  devtools(
    persist(
      (set, get) => ({
        playbackState: 'stopped',
        playbackBPM: 120,
        isPlaying: false,

        stepCount: 16 as StepCount,
        subdivision: '16n' as Subdivision,
        displayMode: 'step' as DisplayMode,

        steps: [] as boolean[][],
        velocities: [] as number[][],

        mainBus: null,
        effectBus: null,
        samplers: [] as Sampler[],
        sequence: null,

        isSequenceInitialized: false,
        soloChannelIds: new Set<string>(),
        isClearWarningRead: false,

        setClearWarningRead: () => set({ isClearWarningRead: true }),

        setPlaybackState: state => {
          const transport = getTransport()
          if (state === 'started') transport.start()
          else if (state === 'paused') transport.pause()
          else transport.stop()

          set({ playbackState: state, isPlaying: state === 'started' })

          if (state === 'started') {
            get().sequence?.start()
          }
          if (state === 'stopped') {
            get().sequence?.stop()
          }
        },

        setPlaybackBPM: bpm => {
          getTransport().bpm.value = bpm
          set({ playbackBPM: bpm })
        },

        togglePlayback: () => {
          const current = get().playbackState
          if (current === 'started') {
            get().setPlaybackState('stopped')
          } else {
            get().setPlaybackState('started')
          }
        },

        setStepCount: stepCount => {
          const { steps, velocities } = get()
          const _steps = steps.map(row =>
            adjustArraySize(row, stepCount, false),
          )
          const _velocities = velocities.map(row =>
            adjustArraySize(row, stepCount, 1),
          )

          set({ stepCount, steps: _steps, velocities: _velocities })
          get().setPlaybackState('stopped')
          initSequence(set, get, true)
        },

        setSubdivision: subdivision => {
          set({ subdivision })
          get().setPlaybackState('stopped')
          initSequence(set, get, true)
        },

        setDisplayMode: displayMode => set({ displayMode }),

        updateStep: (step, sample, active) => {
          const steps = [...get().steps]
          if (!steps[sample]) steps[sample] = []
          steps[sample][step] = active
          set({ steps })
        },

        updateVelocity: (velocity, step, sample) =>
          set(state => ({
            velocities: state.velocities.map((row, i) =>
              i === sample
                ? row.map((v, j) => (j === step ? velocity : v))
                : row,
            ),
          })),

        clearSteps: () => {
          const { steps, velocities, stepCount } = get()
          setStepsAndVelocities(set, steps, velocities, stepCount)
        },

        clearStepRow: row => {
          const { steps, velocities, stepCount } = get()
          const updatedSteps = [...steps]
          const updatedVelocities = [...velocities]

          updatedSteps[row] = Array(stepCount).fill(false)
          updatedVelocities[row] = Array(stepCount).fill(1)

          set({ steps: updatedSteps, velocities: updatedVelocities })
        },

        toggleSoloChannel: channelId => {
          const soloChannelIds = new Set(get().soloChannelIds)
          if (soloChannelIds.has(channelId)) {
            soloChannelIds.delete(channelId)
          } else {
            soloChannelIds.add(channelId)
          }
          set({ soloChannelIds })
          get().updateSoloStates()
        },

        updateSoloStates: () => {
          const { samplers, soloChannelIds } = get()
          samplers.forEach(sampler => {
            sampler.mute =
              soloChannelIds.size > 0 && !soloChannelIds.has(sampler.id)
          })
        },

        updateSamplerColor: (sampleId, color) => {
          const sample = useSampleStore
            .getState()
            .samples.find(s => s.id === sampleId)

          const samplers = get().samplers.map(sampler => {
            if (sampler.id === sampleId) {
              sampler.meta.color = color
              if (sample) {
                useSampleStore.getState().updateSample({ ...sample, color })
              }
            }
            return sampler
          })

          set({ samplers })
        },

        initialize: async () => {
          set({ isSequenceInitialized: false })
          const { samples } = useSampleStore.getState()
          const { steps, stepCount, velocities } = get()

          if (samples.length === 0) throw new Error('No samples loaded')

          const shouldForceUpdate =
            steps.length > 0 && stepCount !== steps[0].length

          initMainBus(set, get)
          initEffectBus(set, get)
          await initSamplers(set, get, samples, shouldForceUpdate)
          initSequence(set, get, shouldForceUpdate)

          if (steps.length === 0 || velocities.length === 0) {
            initStepAndVelocities(set, samples, stepCount)
          }

          get().updateSoloStates()

          set({ isSequenceInitialized: true })
        },
      }),
      {
        name: 'sequencer-store',
        partialize: state => ({
          stepCount: state.stepCount,
          subdivision: state.subdivision,
          displayMode: state.displayMode,
          steps: state.steps,
          velocities: state.velocities,
          isClearWarningRead: state.isClearWarningRead,
        }),
      },
    ),
  ),
)

type SSet = (partial: Partial<SequencerState>) => void
type SGet = () => SequencerState

const initMainBus = (set: SSet, get: SGet) => {
  if (!get().mainBus) {
    set({ mainBus: new MainBus() })
  }
}

const initEffectBus = (set: SSet, get: SGet) => {
  if (!get().effectBus) {
    const effectBus = new EffectBus()
    set({ effectBus })
  }
}

const initSamplers = async (
  set: SSet,
  get: SGet,
  samples: Sample[],
  force: boolean,
) => {
  if (!get().samplers || get().samplers.length < 1 || force) {
    get().samplers.forEach(sampler => sampler.dispose())

    const mainBus = get().mainBus
    if (!mainBus) throw new Error('MainBus not initialized')

    const samplers = await Promise.all(
      samples.map((sample, index) => {
        return new Sampler({
          sampleId: sample.id,
          sampleUrl: sample.url,
          sampleName: sample.name,
          sampleColor: sample.color,
          position: index,
          mainBus,
        })
      }),
    )

    set({ samplers })
  }
}

const initSequence = (set: SSet, get: SGet, force: boolean) => {
  const { sequence, stepCount, subdivision, samplers } = get()

  if (!sequence || force) {
    if (force) sequence?.dispose()

    const newSequence = new Sequence(
      (time, col) => {
        samplers.forEach((sampler, row) => {
          const stepIsActive = get().steps[row][col]
          if (stepIsActive) {
            const velocity = get().velocities[row][col] || 1
            sampler.triggerAttackRelease('C4', '2n', time, velocity)
          }
        })
      },
      Array.from({ length: stepCount }, (_, i) => i),
      subdivision,
    )

    set({ sequence: newSequence })
  }
}

const setStepsAndVelocities = (
  set: SSet,
  steps: boolean[][],
  velocities: number[][],
  stepCount: StepCount,
) => {
  const updatedSteps = steps.map(() => Array(stepCount).fill(false))
  const updatedVelocities = velocities.map(() => Array(stepCount).fill(1))

  set({ steps: updatedSteps, velocities: updatedVelocities })
}

const initStepAndVelocities = (
  set: SSet,
  samples: Sample[],
  stepCount: StepCount,
) => {
  const _steps = samples.map(() =>
    Array.from({ length: stepCount }, () => false),
  )
  const _velocities = samples.map(() =>
    Array.from({ length: stepCount }, () => 1),
  )

  set({ steps: _steps, velocities: _velocities })
}
