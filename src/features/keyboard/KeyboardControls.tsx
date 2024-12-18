import { usePresetStore } from '@/providers/store/presetStore'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function KeyboardControls() {
  const presets = usePresetStore(state => state.synthPresets)
  const currentPreset = usePresetStore(state => state.currentPreset)
  const setPreset = usePresetStore(state => state.setPreset)

  function handleChange(preset: string) {
    if (currentPreset === preset) return
    setPreset(preset)
  }

  return (
    <div>
      <div className='flex space-x-2'>
        <Tabs defaultValue={currentPreset} onValueChange={handleChange}>
          <TabsList>
            {Object.keys(presets).map(preset => (
              <TabsTrigger
                key={`preset-${preset}`}
                value={preset}
                className='capitalize'
              >
                {preset}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
