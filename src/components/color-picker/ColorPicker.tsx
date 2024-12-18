import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { parseRGB, RGB } from '@/lib/color'
import { toast } from 'sonner'

interface Color {
  name: string
  value: string
}

interface ColorPickerProps {
  currentColor: string
  onSavedColor: (color: RGB) => void
}

const COLORS: Color[] = [
  { name: 'Red', value: 'rgb(239, 68, 68)' },
  { name: 'Orange', value: 'rgb(249, 115, 22)' },
  { name: 'Amber', value: 'rgb(245, 158, 11)' },
  { name: 'Yellow', value: 'rgb(234, 179, 8)' },
  { name: 'Lime', value: 'rgb(132, 204, 22)' },
  { name: 'Green', value: 'rgb(34, 197, 94)' },
  { name: 'Emerald', value: 'rgb(16, 185, 129)' },
  { name: 'Teal', value: 'rgb(20, 184, 166)' },
  { name: 'Cyan', value: 'rgb(6, 182, 212)' },
  { name: 'Sky', value: 'rgb(14, 165, 233)' },
  { name: 'Blue', value: 'rgb(59, 130, 246)' },
  { name: 'Indigo', value: 'rgb(99, 102, 241)' },
  { name: 'Violet', value: 'rgb(139, 92, 246)' },
  { name: 'Purple', value: 'rgb(168, 85, 247)' },
  { name: 'Fuchsia', value: 'rgb(217, 70, 239)' },
  { name: 'Pink', value: 'rgb(236, 72, 153)' },
  { name: 'Rose', value: 'rgb(244, 63, 94)' },
]

export function ColorPicker({ currentColor, onSavedColor }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<Color>({
    name: 'Current',
    value: currentColor,
  })

  const handleSave = () => {
    try {
      const rgb = parseRGB(selectedColor.value)
      onSavedColor(rgb)
      toast.success('Color saved successfully')
    } catch (error) {
      console.error(error)
      toast.error('Invalid color value')
    }
  }

  return (
    <div className='grid gap-4'>
      {/* Header Section */}
      <div className='space-y-2'>
        <h4 className='font-medium leading-none'>Select a color</h4>
        <div className='grid grid-cols-5 gap-2'>
          {COLORS.map(color => (
            <Button
              key={color.name}
              className={cn(
                'w-full h-8 p-0 border-2',
                selectedColor.name === color.name
                  ? 'border-gray-100'
                  : 'border-transparent',
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select ${color.name}`}
            >
              {selectedColor.name === color.name && (
                <Check className='w-3 h-3 text-white' />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className='w-full'>
        Save
      </Button>

      {/* Selected Color Preview */}
      <div className='flex items-center space-x-2'>
        <div
          className='w-8 h-8 border border-gray-700 rounded-full'
          style={{ backgroundColor: selectedColor.value }}
        />
        <div>
          <div className='font-medium'>{selectedColor.name}</div>
          <div className='text-sm text-gray-400'>{selectedColor.value}</div>
        </div>
      </div>
    </div>
  )
}
