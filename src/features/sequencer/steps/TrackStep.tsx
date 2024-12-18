import { cn, groupByColumn } from '@/lib/utils'
import { useSequenceStore } from '@/providers/store/sequenceStore'
import { DisplayColor } from '@/types'

interface TrackStepProps {
  row: number
  column: number
  displayColor: DisplayColor
}

export function TrackStep({ row, column, displayColor }: TrackStepProps) {
  const steps = useSequenceStore(state => state.steps)
  const updateStep = useSequenceStore(state => state.updateStep)

  const isStepActive = steps[row][column]

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateStep(column, row, e.target.checked)
  }

  return (
    <li
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          updateStep(column, row, !isStepActive)
        }
      }}
      data-group={groupByColumn(column)}
      className={cn(
        'cell grid border border-border/70 min-w-10 h-full relative overflow-hidden',
        "data-[group='odd']:bg-accent/90 bg-muted/40 rounded-[2px] focus-within:border-foreground",
      )}
    >
      <div
        style={{
          background: isStepActive
            ? `radial-gradient(circle, ${displayColor.primary} 0%, ${displayColor.muted} 100%)`
            : '',
        }}
        className='absolute inset-0'
      />
      <input
        type='checkbox'
        checked={isStepActive}
        onChange={handleChange}
        className='absolute inset-0 opacity-0'
      />
    </li>
  )
}
