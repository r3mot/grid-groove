import { useSequenceStore } from '@/stores/sequenceStore'
import { Fragment } from 'react/jsx-runtime'
import { MainBusChannel } from './channels/MainBusChannel'
import { SamplerChannel } from './channels/SamplerChannel'
import { EffectBusChannel } from './channels/EffectBusChannel'

export function ChannelMixer() {
  const samplers = useSequenceStore(state => state.samplers)

  return (
    <section className='w-fit'>
      <div className='overflow-hidden border rounded-md bg-card'>
        <div className='flex p-2 gap-x-px'>
          <MainBusChannel />
          <EffectBusChannel />
          <Fragment>
            {samplers.map(sampler => (
              <SamplerChannel
                key={sampler.id}
                sampler={sampler}
                canRouteToBus
              />
            ))}
          </Fragment>
        </div>
      </div>
    </section>
  )
}
