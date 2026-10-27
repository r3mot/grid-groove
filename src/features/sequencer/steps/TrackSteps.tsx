import { usePatternStore } from '@/stores/patternStore'
import { TrackStep } from './TrackStep'
import { Sample } from '@/types'

interface TrackStepsProps {
  sample: Sample
  row: number
}

export function TrackSteps({ sample, row }: TrackStepsProps) {
  const stepCount = usePatternStore(state => state.stepCount)
  const rowSteps = usePatternStore(state => state.steps[row])
  const setStep = usePatternStore(state => state.setStep)

  function handleStepChange(step: number, row: number, active: boolean) {
    setStep(row, step, active)
  }

  return (
    <ul className='grid grid-flow-col gap-1 p-1 py-1.5 w-full'>
      {[...Array(stepCount).keys()].map(step => (
        <TrackStep
          key={`${row}-${step}`}
          row={row}
          column={step}
          displayColor={sample.color}
          isActive={rowSteps?.[step] ?? false}
          onStepChange={handleStepChange}
        />
      ))}
    </ul>
  )
}
