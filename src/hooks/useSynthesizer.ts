import { Synthesizer } from '@/features/core/Synthesizer'
import { presetSelector, usePresetStore } from '@/stores/presetStore'
import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/shallow'

export function useSynthesizer() {
  const { currentPreset, synthPresets, effectPresets } = usePresetStore(
    useShallow(presetSelector),
  )

  const synth = useRef<Synthesizer | undefined>(undefined)

  useEffect(() => {
    if (!synth.current) {
      synth.current = new Synthesizer({
        options: synthPresets[currentPreset],
        effectConfig: effectPresets[currentPreset],
        presetName: currentPreset,
      })
    }

    return () => {
      synth.current?.destroy()
      synth.current = undefined
    }
  }, [synthPresets, effectPresets, currentPreset])

  return synth
}
