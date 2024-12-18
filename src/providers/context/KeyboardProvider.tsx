import { KEYBOARD_LAYOUT } from '@/lib/constants'
import { usePresetStore } from '../store/presetStore'
import { useCallback, useEffect, useRef } from 'react'
import {
  AutoPanner,
  Chorus,
  Distortion,
  getDestination,
  MonoSynth,
  PingPongDelay,
  PolySynth,
  Reverb,
} from 'tone'
import { KeyboardContext } from './KeyboardContext'

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
  const reverbRef = useRef(new Reverb(0.5))
  const chorusRef = useRef(new Chorus(0.3, 2.5, 0.3))
  const delayRef = useRef(new PingPongDelay('8n', 0.3))
  const autoPanRef = useRef(new AutoPanner(0.2))
  const distortionRef = useRef(new Distortion())

  const polySynthRef = useRef<PolySynth | undefined>()
  const keyMapRef = useRef<Record<string, string>>(KEYBOARD_LAYOUT)

  const synthPresets = usePresetStore(state => state.synthPresets)
  const effectPresets = usePresetStore(state => state.effectPresets)
  const currentPreset = usePresetStore(state => state.currentPreset)

  const activeNotesRef = useRef(new Set<string>())

  const createPolySynth = useCallback(() => {
    const synth = new PolySynth({
      maxPolyphony: Object.keys(keyMapRef.current).length,
      voice: MonoSynth,
      options: synthPresets[currentPreset],
    })

    /**
     * TODO: Add a volume control to the synth
     */
    synth.volume.value = -30

    synth.chain(
      chorusRef.current,
      delayRef.current,
      reverbRef.current,
      getDestination(),
    )

    return synth
  }, [currentPreset, synthPresets])

  useEffect(() => {
    const effectConfig = effectPresets[currentPreset]

    polySynthRef.current = createPolySynth()

    // update effects baded on the current preset
    reverbRef.current.decay = effectConfig.reverb.decay
    reverbRef.current.wet.value = effectConfig.reverb.wet

    chorusRef.current.frequency.value = effectConfig.chorus.frequency
    chorusRef.current.depth = effectConfig.chorus.depth
    chorusRef.current.delayTime = effectConfig.chorus.delayTime
    chorusRef.current.wet.value = effectConfig.chorus.wet

    delayRef.current.delayTime.value = effectConfig.delay.delayTime
    delayRef.current.feedback.value = effectConfig.delay.feedback
    delayRef.current.wet.value = effectConfig.delay.wet

    autoPanRef.current.frequency.value = effectConfig.autoPanner.frequency

    distortionRef.current.distortion = effectConfig.distortion.distortion

    polySynthRef.current.chain(
      chorusRef.current,
      delayRef.current,
      reverbRef.current,
      autoPanRef.current,
      distortionRef.current,
      getDestination(),
    )

    return () => {
      polySynthRef.current?.dispose()
    }
  }, [createPolySynth, currentPreset, effectPresets])

  return (
    <KeyboardContext.Provider
      value={{
        keyMap: keyMapRef.current,
        activeNotes: activeNotesRef.current,
        polySynthRef,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  )
}
