import { useSequenceStore } from '@/providers/store/sequenceStore'
import { ChannelPan } from '../controls/ChannelPan'
import { ChannelFader } from '../controls/ChannelFader'
import { ChannelMeter } from '../controls/ChannelMeter'
import { ChannelStrip } from '../presentation/ChannelStrip'
import { ChannelName } from '../presentation/ChannelName'

export function MainBusChannel() {
  const mainBus = useSequenceStore(state => state.mainBus)

  if (!mainBus) return null

  return (
    <ChannelStrip className='bg-muted'>
      <ChannelName name='main' />
      <ChannelPan source={mainBus} />
      <div className='w-full gap-1 px-2 flex-center'>
        <ChannelFader channel={mainBus} />
        <ChannelMeter meter={mainBus.meter} height={150} />
      </div>
      {/* takes place of effect send for now */}
      <div className='mt-auto'></div>
    </ChannelStrip>
  )
}
