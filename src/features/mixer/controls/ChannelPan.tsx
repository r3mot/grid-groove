import { Channel } from 'tone'
import { RotaryKnob } from '@/components/rotary-knob/RotaryKnob'
import { Fragment } from 'react/jsx-runtime'
import { Label } from '@/components/ui/label'

interface ChannelPanProps {
  source: Channel
}

export function ChannelPan({ source }: ChannelPanProps) {
  function handleChange(pan: number) {
    source.pan.value = pan
  }
  return (
    <Fragment>
      <RotaryKnob
        initialValue={0}
        minValue={-1}
        maxValue={1}
        onValueChange={handleChange}
      />
      <Label className='mb-4 text-xs'>PAN</Label>
    </Fragment>
  )
}
