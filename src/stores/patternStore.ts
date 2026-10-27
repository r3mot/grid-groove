import { adjustArraySize } from '@/lib/utils'
import { StepCount, Subdivision } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { legacySequencerState as legacy } from './utils/legacySequencerState'

const DEFAULT_VELOCITY = 1

interface PatternState {
  stepCount: StepCount
  subdivision: Subdivision
  steps: boolean[][]
  velocities: number[][]

  setStepCount: (stepCount: StepCount) => void
  setSubdivision: (subdivision: Subdivision) => void
  setStep: (row: number, step: number, active: boolean) => void
  setVelocity: (row: number, step: number, velocity: number) => void
  clearSteps: () => void
  clearStepRow: (row: number) => void
  ensureTracks: (trackCount: number) => void
}

const emptySteps = (stepCount: number) => Array<boolean>(stepCount).fill(false)
const defaultVelocities = (stepCount: number) =>
  Array<number>(stepCount).fill(DEFAULT_VELOCITY)

const replaceAt = <T>(rows: T[][], row: number, step: number, value: T) =>
  rows.map((r, i) =>
    i === row ? r.map((v, j) => (j === step ? value : v)) : r,
  )

export const usePatternStore = create<PatternState>()(
  devtools(
    persist(
      (set, get) => ({
        stepCount: legacy.stepCount ?? 16,
        subdivision: legacy.subdivision ?? '16n',
        steps: legacy.steps ?? [],
        velocities: legacy.velocities ?? [],

        setStepCount: stepCount =>
          set(state => ({
            stepCount,
            steps: state.steps.map(row =>
              adjustArraySize(row, stepCount, false),
            ),
            velocities: state.velocities.map(row =>
              adjustArraySize(row, stepCount, DEFAULT_VELOCITY),
            ),
          })),

        setSubdivision: subdivision => set({ subdivision }),

        setStep: (row, step, active) =>
          set(state => ({ steps: replaceAt(state.steps, row, step, active) })),

        setVelocity: (row, step, velocity) =>
          set(state => ({
            velocities: replaceAt(state.velocities, row, step, velocity),
          })),

        clearSteps: () =>
          set(state => ({
            steps: state.steps.map(() => emptySteps(state.stepCount)),
            velocities: state.velocities.map(() =>
              defaultVelocities(state.stepCount),
            ),
          })),

        clearStepRow: row =>
          set(state => ({
            steps: state.steps.map((r, i) =>
              i === row ? emptySteps(state.stepCount) : r,
            ),
            velocities: state.velocities.map((r, i) =>
              i === row ? defaultVelocities(state.stepCount) : r,
            ),
          })),

        // makes sure there is a full-length row for every track
        ensureTracks: trackCount => {
          const { steps, velocities, stepCount } = get()
          set({
            steps: Array.from({ length: trackCount }, (_, i) =>
              adjustArraySize(steps[i] ?? [], stepCount, false),
            ),
            velocities: Array.from({ length: trackCount }, (_, i) =>
              adjustArraySize(velocities[i] ?? [], stepCount, DEFAULT_VELOCITY),
            ),
          })
        },
      }),
      {
        name: 'pattern-store',
        version: 0,
        partialize: state => ({
          stepCount: state.stepCount,
          subdivision: state.subdivision,
          steps: state.steps,
          velocities: state.velocities,
        }),
      },
    ),
  ),
)
