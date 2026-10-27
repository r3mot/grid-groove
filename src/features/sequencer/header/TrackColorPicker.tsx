import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ColorPicker } from '@/components/color-picker/ColorPicker'
import { useSampleStore } from '@/stores/sampleStore'
import { DisplayColor } from '@/types'

interface TrackColorPickerProps {
  trackId: string
  currentColor: DisplayColor
}

export function TrackColorPicker({
  trackId,
  currentColor,
}: TrackColorPickerProps) {
  const sample = useSampleStore(state =>
    state.samples.find(s => s.id === trackId),
  )
  const updateSample = useSampleStore(state => state.updateSample)
  const [open, setOpen] = useState(false)

  function handleChange(color: DisplayColor) {
    if (sample) updateSample({ ...sample, color })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        style={{ backgroundColor: currentColor }}
        className='w-4 h-4 border rounded-full border-foreground/10'
        aria-label='Change color'
      />
      <PopoverContent>
        <ColorPicker currentColor={currentColor} onSavedColor={handleChange} />
      </PopoverContent>
    </Popover>
  )
}
