import { useSequenceStore } from '@/providers/store/sequenceStore'
import { ChannelPan } from '../controls/ChannelPan'
import { ChannelFader } from '../controls/ChannelFader'
import { ChannelMeter } from '../controls/ChannelMeter'
import { ChannelStrip } from '../presentation/ChannelStrip'
import { ChannelName } from '../presentation/ChannelName'

export function EffectBusChannel() {
  const effectBus = useSequenceStore(state => state.effectBus)

  if (!effectBus) return null

  const { channel, meter } = effectBus

  return (
    <ChannelStrip className='bg-muted'>
      <ChannelName name='aux' />
      <ChannelPan source={channel} />
      <div className='w-full gap-1 px-2 flex-center'>
        <ChannelFader channel={channel} />
        <ChannelMeter meter={meter} height={150} />
      </div>
      {/* takes place of effect send for now */}
      <div className='mt-auto'></div>
    </ChannelStrip>
  )
}
