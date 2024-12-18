import { useSequenceStore } from '@/providers/store/sequenceStore'
import { TrackVelocity } from './TrackVelocity'
import { Sampler } from '@/features/core/Sampler'

interface TrackVelocitiesProps {
  sampler: Sampler
}

export function TrackVelocities({ sampler }: TrackVelocitiesProps) {
  const stepCount = useSequenceStore(state => state.stepCount)

  const { position, color } = sampler.meta

  return (
    <ul className='grid grid-flow-col gap-1 p-1 py-1.5 w-full'>
      {[...Array(stepCount).keys()].map(step => (
        <li key={`step-${position}-${step}`}>
          <TrackVelocity row={position} column={step} displayColor={color} />
        </li>
      ))}
    </ul>
  )
}
