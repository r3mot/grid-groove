import { radialGradient } from '@/lib/color'
import { cn, groupByColumn } from '@/lib/utils'
import { DisplayColor } from '@/types'

interface TrackStepProps {
  row: number
  column: number
  displayColor: DisplayColor
  isActive: boolean
  onStepChange: (column: number, row: number, value: boolean) => void
}

export function TrackStep({
  row,
  column,
  displayColor,
  isActive,
  onStepChange,
}: TrackStepProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onStepChange(column, row, e.target.checked)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onStepChange(column, row, !isActive)
    }
  }

  return (
    <li
      onKeyDown={handleKeyDown}
      data-group={groupByColumn(column)}
      className={cn(
        'cell grid border border-border/70 w-full h-full relative overflow-hidden',
        "data-[group='odd']:bg-accent/90 bg-muted/40 rounded-[2px] focus-within:border-foreground",
      )}
    >
      <div
        style={{
          background: isActive ? radialGradient(displayColor) : '',
        }}
        className='absolute inset-0'
      />
      <input
        type='checkbox'
        checked={isActive}
        onChange={handleChange}
        className='absolute inset-0 opacity-0'
      />
    </li>
  )
}
