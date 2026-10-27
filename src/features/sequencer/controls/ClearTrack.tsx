import { usePatternStore } from '@/stores/patternStore'
import { Trash2Icon } from 'lucide-react'

export function ClearTrack({ row }: { row: number }) {
  const clearStepRow = usePatternStore(state => state.clearStepRow)

  function handleClick() {
    clearStepRow(row)
  }
  return (
    <button onClick={handleClick}>
      <Trash2Icon className='p-1 m-auto cursor-pointer text-muted-foreground hover:text-destructive' />
    </button>
  )
}
