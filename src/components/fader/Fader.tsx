import { DECIBEL_RANGE } from '@/lib/constants'
import { Slider } from '../ui/slider'
import { useDecibelGain } from '@/hooks/useDecibelGain'
import { dbToGain } from 'tone'

interface FaderProps {
  minDb?: number
  maxDb?: number
  step?: number
  valueDb: number
  height?: number
  onChange: (value: number) => void
}

export function Fader({
  minDb = DECIBEL_RANGE.minDb,
  maxDb = DECIBEL_RANGE.maxDb,
  height = 150,
  step = 0.001,
  valueDb,

  onChange,
}: FaderProps) {
  const { fader } = useDecibelGain(minDb, maxDb, onChange)

  const gainValue = dbToGain(valueDb)

  return (
    <div>
      <Slider
        style={{
          height: `${height}px`,
        }}
        aria-valuemin={fader.minGain}
        aria-valuemax={fader.maxGain}
        aria-valuenow={gainValue}
        orientation='vertical'
        className='w-5'
        min={fader.minGain}
        max={fader.maxGain}
        step={step}
        value={[gainValue]}
        onValueChange={fader.handleValueChange}
      />
    </div>
  )
}
