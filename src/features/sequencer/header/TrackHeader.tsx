import { TrackColorPicker } from './TrackColorPicker'
import { MuteChannel } from '../controls/MuteChannel'
import { SoloChannel } from '../controls/SoloChannel'
import { Sampler } from '@/features/core/Sampler'

interface TrackHeaderProps {
  sampler: Sampler
}

export function TrackHeader({ sampler }: TrackHeaderProps) {
  const { id, color, name } = sampler.meta

  return (
    <div className='relative flex items-center justify-between px-2 py-1 pl-4'>
      <div className='flex items-center gap-2'>
        <TrackColorPicker trackId={id} currentColor={color.primary} />
        <span className='text-sm select-none'>{name}</span>
      </div>
      <div className='space-x-1'>
        <MuteChannel channel={sampler.channel} />
        <SoloChannel id={id} />
      </div>
    </div>
  )
}
