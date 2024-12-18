import { useSequenceStore } from '@/providers/store/sequenceStore'
import { TrackStep } from './TrackStep'
import { Sampler } from '@/features/core/Sampler'

interface TrackStepsProps {
  sampler: Sampler
}

export function TrackSteps({ sampler }: TrackStepsProps) {
  const stepCount = useSequenceStore(state => state.stepCount)

  return (
    <ul className='gap-1 p-1 py-1.5 grid grid-flow-col'>
      {[...Array(stepCount).keys()].map(step => (
        <TrackStep
          key={step}
          row={sampler.meta.position}
          column={step}
          displayColor={sampler.meta.color}
        />
      ))}
    </ul>
  )
}
