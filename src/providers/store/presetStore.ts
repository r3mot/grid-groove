import { MonoSynthOptions } from 'tone'
import {
  Frequency,
  Milliseconds,
  NormalRange,
  Seconds,
  Time,
} from 'tone/build/esm/core/type/Units'
import { RecursivePartial } from 'tone/build/esm/core/util/Interface'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface EffectPreset {
  reverb: {
    decay: Seconds
    wet: NormalRange
  }
  chorus: {
    frequency: Frequency
    depth: NormalRange
    delayTime: Milliseconds
    wet: NormalRange
  }
  delay: {
    delayTime: Time
    feedback: NormalRange
    wet: NormalRange
  }
  autoPanner: {
    frequency: Frequency
    wet: NormalRange
  }
  distortion: {
    distortion: number
    wet: NormalRange
  }
}

interface PresetStore {
  synthPresets: Record<string, RecursivePartial<MonoSynthOptions>>
  effectPresets: Record<string, EffectPreset>
  currentPreset: string
  setPreset: (presetName: string) => void
}

export const usePresetStore = create<PresetStore>()(
  devtools(
    persist(
      set => ({
        synthPresets: {
          default: {
            oscillator: { type: 'square' },
            envelope: {
              attack: 0.01,
              decay: 0.2,
              sustain: 0.4,
              release: 0.3,
            },
            filterEnvelope: {
              attack: 0.01,
              decay: 0.2,
              sustain: 0.4,
              release: 0.3,
              baseFrequency: 800,
              octaves: 2,
            },
          },

          loFi: {
            oscillator: { type: 'triangle' },
            envelope: {
              attack: 0.2,
              decay: 0.4,
              sustain: 0.3,
              release: 1.0,
            },
            filterEnvelope: {
              attack: 0.1,
              decay: 0.4,
              sustain: 0.3,
              release: 1.0,
              baseFrequency: 400,
              octaves: 1.5,
            },
          },

          spacious: {
            oscillator: { type: 'sine' },
            envelope: {
              attack: 1.0,
              decay: 2.0,
              sustain: 0.8,
              release: 4.0,
            },
            filterEnvelope: {
              attack: 1.0,
              decay: 2.0,
              sustain: 0.8,
              release: 4.0,
              baseFrequency: 500,
              octaves: 1,
            },
          },

          moog: {
            oscillator: { type: 'sawtooth' },
            envelope: {
              attack: 0.1,
              decay: 0.3,
              sustain: 0.6,
              release: 0.7,
            },
            filterEnvelope: {
              attack: 0.05,
              decay: 0.3,
              sustain: 0.6,
              release: 0.7,
              baseFrequency: 200,
              octaves: 3.5,
            },
          },
        },
        effectPresets: {
          default: {
            reverb: { decay: 0.01, wet: 0.01 },
            chorus: {
              frequency: 0.01,
              depth: 0.01,
              delayTime: 0.01,
              wet: 0.01,
            },
            delay: { delayTime: '8n', feedback: 0.01, wet: 0.01 },
            autoPanner: { frequency: 0.01, wet: 0.01 },
            distortion: { distortion: 0.01, wet: 0.01 },
          },
          loFi: {
            reverb: { decay: 2.5, wet: 0.2 },
            chorus: { frequency: 0.6, depth: 0.5, delayTime: 4.0, wet: 0.2 },
            delay: { delayTime: '4n', feedback: 0.2, wet: 0.1 },
            autoPanner: { frequency: 0.3, wet: 0.4 },
            distortion: { distortion: 0.3, wet: 0.3 },
          },
          spacious: {
            reverb: { decay: 4.0, wet: 0.8 },
            chorus: { frequency: 1.0, depth: 0.6, delayTime: 3.0, wet: 0.5 },
            delay: { delayTime: '4n', feedback: 0.7, wet: 0.6 },
            autoPanner: { frequency: 0.1, wet: 0.3 },
            distortion: { distortion: 0.0, wet: 0.0 },
          },
          moog: {
            reverb: { decay: 1.2, wet: 0.5 },
            chorus: { frequency: 1.2, depth: 0.6, delayTime: 2.0, wet: 0.6 },
            delay: { delayTime: '8n', feedback: 0.4, wet: 0.5 },
            distortion: { distortion: 0.7, wet: 0.7 },
            autoPanner: { frequency: 2.0, wet: 0.4 },
          },
        },

        currentPreset: 'default',
        setPreset: presetName => set(() => ({ currentPreset: presetName })),
      }),
      { name: 'preset-store' },
    ),
  ),
)
