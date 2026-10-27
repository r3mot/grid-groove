import { audioEngine } from '@/audio/engine'
import { useSampleStore } from '@/stores/sampleStore'
import { useUIStore } from '@/stores/uiStore'
import { TrackHeader } from './header/TrackHeader'
import { cn } from '@/lib/utils'
import { TrackSteps } from './steps/TrackSteps'
import { TrackVelocities } from './velocity/TrackVelocities'
import { ClearTrack } from './controls/ClearTrack'
import { ComponentType } from 'react'
import { Sample } from '@/types'

function ShadowContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'grid w-full p-px bg-background',
        'group-first:rounded-t-md group-last:rounded-b-md',
        'group-first:shadow-inset-top',
        'shadow-inset-side',
        'group-last:shadow-inset-bottom',
      )}
    >
      {children}
    </div>
  )
}

const TrackContents: Record<
  string,
  ComponentType<{ sample: Sample; row: number }>
> = {
  step: TrackSteps,
  velocity: TrackVelocities,
}

export function StepSequencer() {
  const samples = useSampleStore(state => state.samples)
  const displayMode = useUIStore(state => state.displayMode)
  const TrackContent = TrackContents[displayMode]

  return (
    <section className='w-full py-4 lg:border lg:rounded-md bg-card'>
      <ul className='overflow-x-auto scrollbar'>
        {samples.map((sample, row) => (
          <li key={sample.id} className='grid grid-cols-[1fr_3rem] group'>
            <div className='grid grid-cols-[13rem_1fr] lg:grid-cols-[20rem_1fr] border-b group-last:border-b-0'>
              <TrackHeader
                sample={sample}
                sampler={audioEngine.getSampler(sample.id)}
              />
              <ShadowContainer>
                {TrackContent && <TrackContent sample={sample} row={row} />}
              </ShadowContainer>
            </div>
            <ClearTrack row={row} />
          </li>
        ))}
      </ul>
    </section>
  )
}
