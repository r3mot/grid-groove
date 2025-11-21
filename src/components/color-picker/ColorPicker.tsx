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
    <div className='space-y-4'>
      <h4 className='text-sm font-medium'>Select a color</h4>

      <div className='grid grid-cols-6 gap-2'>
        {COLORS.map(color => {
          const isSelected = selectedColor === color

          return (
            <Button
              key={color}
              data-testid={color}
              variant='outline'
              size='sm'
              className={cn(
                'relative h-8 w-full p-0 border rounded-md',
                isSelected
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-muted',
              )}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            >
              {isSelected && (
                <Check className='w-3 h-3 text-white drop-shadow' />
              )}
            </Button>
          )
        })}
      </div>

      <Button
        onClick={handleSave}
        className='w-full bg-accent text-foreground hover:bg-accent/70 cursor-pointer'
        data-testid='save-color-btn'
      >
        Save
      </Button>
    </div>
  )
}
