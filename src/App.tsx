import { StepSequencer } from '@/features/sequencer/StepSequencer'
import { TransportPanel } from '@/features/transport/TransportPanel'
import { ChannelMixer } from '@/features/mixer/ChannelMixer'
import { Keyboard } from '@/features/keyboard/Keyboard'

export default function App() {
  return (
    <main className='flex items-center justify-center h-screen bg-background '>
      <div className='container mx-auto overflow-hidden '>
        <div className='space-y-1 overflow-hidden '>
          <div className='w-full space-y-1'>
            <TransportPanel />
            <StepSequencer />
          </div>
          <div className='flex flex-col w-full gap-1 lg:flex-row'>
            <ChannelMixer />
            <Keyboard />
          </div>
        </div>
      </div>
    </main>
  )
}
