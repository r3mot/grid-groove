import { useSampleStore } from '@/providers/store/sampleStore'
import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ColorPicker } from '@/components/color-picker/ColorPicker'
import { RGB } from '@/lib/color'

interface ColorPickerProps {
  trackId: string
  currentColor: string
}

export function TrackColorPicker({ trackId, currentColor }: ColorPickerProps) {
  const updateSample = useSampleStore(state => state.updateSample)
  const [open, setOpen] = useState(false)

  function handleChange(color: RGB) {
    updateSample({
      id: trackId,
      color: {
        primary: `rgb(${color.r}, ${color.g}, ${color.b})`,
        muted: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
        contrast: `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`,
      },
    })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        style={{
          backgroundColor: currentColor,
        }}
        className='w-4 h-4 border rounded-full border-foreground/10'
        aria-label='Change color'
      />
      <PopoverContent>
        <ColorPicker currentColor={currentColor} onSavedColor={handleChange} />
      </PopoverContent>
    </Popover>
  )
}
