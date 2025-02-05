import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ColorPicker } from '@/components/color-picker/ColorPicker'
import { useSequenceStore } from '@/stores/sequenceStore'
import { DisplayColor } from '@/types'

interface TrackColorPickerProps {
  trackId: string
  currentColor: DisplayColor
}

export function TrackColorPicker({
  trackId,
  currentColor,
}: TrackColorPickerProps) {
  const updateSampler = useSequenceStore(state => state.updateSamplerColor)
  const [open, setOpen] = useState(false)

  function handleChange(color: DisplayColor) {
    updateSampler(trackId, color)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        style={{ backgroundColor: currentColor.primary }}
        className='w-4 h-4 border rounded-full border-foreground/10'
        aria-label='Change color'
      />
      <PopoverContent>
        <ColorPicker currentColor={currentColor} onSavedColor={handleChange} />
      </PopoverContent>
    </Popover>
  )
}
