import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { COLORS } from '@/lib/color'
import { toast } from 'sonner'
import { DisplayColor } from '@/types'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  currentColor: DisplayColor
  onSavedColor: (color: DisplayColor) => void
}

export function ColorPicker({ currentColor, onSavedColor }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor)

  const handleSave = () => {
    onSavedColor(selectedColor)
    toast.success('Color saved successfully')
  }

  return (
    <div className='grid gap-4'>
      <h4 className='font-medium leading-none'>Select a color</h4>
      <div className='grid grid-cols-5 gap-2'>
        {COLORS.map(color => {
          const isSelectedColor = selectedColor.primary === color.primary
          return (
            <Button
              data-testid={color.primary}
              className={cn(
                'w-full h-8 p-0 border-2',
                isSelectedColor ? 'border-gray-100' : 'border-transparent',
              )}
              style={{ backgroundColor: color.primary }}
              onClick={() => setSelectedColor(color)}
            >
              {isSelectedColor && <Check className='w-3 h-3 text-white' />}
            </Button>
          )
        })}
      </div>

      <Button
        onClick={handleSave}
        className='w-full'
        data-testid='save-color-btn'
      >
        Save
      </Button>
    </div>
  )
}
