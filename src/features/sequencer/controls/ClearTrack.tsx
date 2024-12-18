import { useSequenceStore } from '@/providers/store/sequenceStore'
import { Trash2Icon } from 'lucide-react'

export function ClearTrack({ row }: { row: number }) {
  const clearStepRow = useSequenceStore(state => state.clearStepRow)

  function handleClick() {
    clearStepRow(row)
  }
  return (
    <button onClick={handleClick}>
      <Trash2Icon className='p-1 m-auto cursor-pointer text-muted-foreground hover:text-destructive' />
    </button>
  )
}
