import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createSamples, getPathAndName } from './utils/sampleUtils'
import { Sample } from '@/types'

const samplePaths = [
  '/audio/clhat.wav',
  '/audio/gathat.wav',
  '/audio/kick1.wav',
  '/audio/kick2.wav',
  '/audio/snare1.wav',
  '/audio/snare2.wav',
  '/audio/snap.wav',
  '/audio/ride.wav',
]

const initialSamples: Sample[] = createSamples(getPathAndName(samplePaths))

interface SampleState {
  samples: Sample[]
  maxSamples: number
  addSample: (sample: Sample) => void
  replaceSample: (sample: Sample) => void
  initialize: () => void
}

export const useSampleStore = create<SampleState>()(
  devtools(
    persist(
      set => ({
        samples: initialSamples,
        maxSamples: 8,
        addSample: sample =>
          set(state => ({
            samples: [...state.samples, sample],
          })),
        replaceSample: sample =>
          set(state => ({
            samples: state.samples.map(s => (s.id === sample.id ? sample : s)),
          })),
        initialize: () => {
          // fake set
          set(state => state)
        },
      }),
      {
        name: 'sample-store',
      },
    ),
  ),
)
