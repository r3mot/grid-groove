import { usePatternStore } from '@/stores/patternStore'
import { TrackVelocity } from './TrackVelocity'
import { Sample } from '@/types'

interface TrackVelocitiesProps {
  sample: Sample
  row: number
}

export function TrackVelocities({ sample, row }: TrackVelocitiesProps) {
  const stepCount = usePatternStore(state => state.stepCount)

  return (
    <ul className='grid grid-flow-col gap-1 p-1 py-1.5 w-full'>
      {[...Array(stepCount).keys()].map(step => (
        <li key={`step-${row}-${step}`}>
          <TrackVelocity row={row} column={step} displayColor={sample.color} />
        </li>
      ))}
    </ul>
  )
}
