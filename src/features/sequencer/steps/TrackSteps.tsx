import { useSequenceStore } from '@/stores/sequenceStore'
import { TrackStep } from './TrackStep'
import { Sampler } from '@/features/core/Sampler'

interface TrackStepsProps {
  sampler: Sampler
}

export function TrackSteps({ sampler }: TrackStepsProps) {
  const stepCount = useSequenceStore(state => state.stepCount)
  const steps = useSequenceStore(state => state.steps)
  const updateStep = useSequenceStore(state => state.updateStep)

  const { position, color } = sampler.meta

  return (
    <ul className='grid grid-flow-col gap-1 p-1 py-1.5 w-full'>
      {[...Array(stepCount).keys()].map(step => (
        <TrackStep
          key={`${position}-${step}`}
          row={position}
          column={step}
          displayColor={color}
          isActive={steps[position][step]}
          onStepChange={updateStep}
        />
      ))}
    </ul>
  )
}
