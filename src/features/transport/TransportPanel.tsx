import { InsetBorder } from '@/components/InsetBorder'
import { DisplayModeTabs } from './DisplayModeTabs'
import { Metronome } from './Metronome'
import { StepCount } from './StepCount'
import { TransportBPM } from './TransportBPM'
import { SpectrumAnalyser } from '@/components/spectrum-analyser/SpectrumAnalyser'
import { TransportControls } from './TransportControls'
import { ClearStepsDialog } from './ClearStepsDialog'

export function TransportPanel() {
  return (
    <header className='flex items-center border rounded-md justify-centerw-full h-fit bg-card'>
      <div className='flex items-center justify-between w-full gap-2 py-4 mx-auto max-w-7xl'>
        <div className='flex items-center gap-2'>
          <TransportControls />
          <Metronome />
          <ClearStepsDialog />
        </div>
        <div className='flex items-center gap-2'>
          <StepCount />
          <DisplayModeTabs />
          <TransportBPM />
        </div>
        <InsetBorder className='h-10'>
          <SpectrumAnalyser height={36} />
        </InsetBorder>
      </div>
    </header>
  )
}
