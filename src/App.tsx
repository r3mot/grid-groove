import { StepSequencer } from '@/features/sequencer/StepSequencer'
import { TransportPanel } from '@/features/transport/TransportPanel'
import { ChannelMixer } from '@/features/mixer/ChannelMixer'
import { Keyboard } from '@/features/keyboard/Keyboard'

export default function App() {
  return (
    <main className='lg:flex items-center justify-center min-h-screen bg-background relative'>
      <div className='lg:container mx-auto overflow-hidden'>
        <div className='space-y-1 overflow-hidden '>
          <div className='w-full space-y-1'>
            <TransportPanel />
            <StepSequencer />
          </div>
          <div className='hidden xl:flex w-full gap-1'>
            <ChannelMixer />
            <Keyboard />
          </div>
        </div>
      </div>
    </main>
  )
}
