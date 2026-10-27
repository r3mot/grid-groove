import { TrackColorPicker } from './TrackColorPicker'
import { MuteChannel } from '../controls/MuteChannel'
import { SoloChannel } from '../controls/SoloChannel'
import { Sampler } from '@/features/core/Sampler'
import { Sample } from '@/types'

interface TrackHeaderProps {
  sample: Sample
  sampler?: Sampler
}

export function TrackHeader({ sample, sampler }: TrackHeaderProps) {
  const { id, color, name } = sample

  return (
    <div className='relative flex items-center justify-between px-2 py-1 pl-4'>
      <div className='flex items-center gap-2'>
        <TrackColorPicker trackId={id} currentColor={color} />
        <span className='text-sm select-none'>{name}</span>
      </div>
      <div className='space-x-1'>
        {sampler && <MuteChannel channel={sampler.channel} />}
        <SoloChannel id={id} />
      </div>
    </div>
  )
}
