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
    <header className='sticky top-0 z-10 w-full border-b shadow-lg lg:relative lg:shadow-none lg:border lg:rounded-md bg-card'>
      <div className='flex items-center justify-center w-full gap-4 py-2 mx-auto lg:py-4 lg:gap-2 lg:justify-between max-w-7xl px-4'>
        <div className='flex items-center gap-4 lg:gap-2'>
          <TransportControls />
          <Metronome />
          <ClearStepsDialog />
        </div>
        <div className='items-center hidden gap-4 lg:flex lg:gap-2'>
          <StepCount />
          <DisplayModeTabs />
          <TransportBPM />
        </div>
        <div className='hidden lg:block'>
          <InsetBorder className='h-10'>
            <SpectrumAnalyser height={36} />
          </InsetBorder>
        </div>
      </div>
    </header>
  )
}
