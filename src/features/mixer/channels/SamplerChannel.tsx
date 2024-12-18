import { ChannelPan } from '../controls/ChannelPan'
import { ChannelFader } from '../controls/ChannelFader'
import { ChannelMeter } from '../controls/ChannelMeter'
import { ChannelStrip } from '../presentation/ChannelStrip'
import { ChannelName } from '../presentation/ChannelName'
import { Sampler } from '@/features/core/Sampler'
import { EffectSend } from '../controls/EffectSend'

interface SamplerChannelProps {
  sampler: Sampler
  canRouteToBus?: boolean
}
export function SamplerChannel({
  sampler,
  canRouteToBus,
}: SamplerChannelProps) {
  const { channel, meter } = sampler

  return (
    <ChannelStrip>
      <ChannelName name={sampler.sampleName} />
      <ChannelPan source={channel} />
      <div className='w-full gap-1 px-2 flex-center'>
        <ChannelFader channel={channel} height={150} />
        <ChannelMeter meter={meter} height={150} />
      </div>
      {canRouteToBus ? (
        <EffectSend source={channel} />
      ) : (
        <div className='mt-auto'></div>
      )}
    </ChannelStrip>
  )
}
