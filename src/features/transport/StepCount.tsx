import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSequenceStore } from '@/stores/sequenceStore'
import { type StepCount } from '@/types'

export function StepCount() {
  const stepCount = useSequenceStore(state => state.stepCount)
  const setStepCount = useSequenceStore(state => state.setStepCount)

  function handleChange(steps: string) {
    setStepCount(parseInt(steps, 10) as StepCount)
  }

  return (
    <Select onValueChange={handleChange} defaultValue={stepCount.toString()}>
      <SelectTrigger
        aria-label='step count'
        className='max-w-32 hover:bg-muted'
      >
        <SelectValue placeholder='Step Count' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='8'>8 steps</SelectItem>
        <SelectItem value='16'>16 steps</SelectItem>
        <SelectItem value='32'>32 steps</SelectItem>
      </SelectContent>
    </Select>
  )
}
