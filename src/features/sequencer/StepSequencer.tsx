import { useSequenceStore } from '@/stores/sequenceStore'
import { TrackHeader } from './header/TrackHeader'
import { cn } from '@/lib/utils'
import { TrackSteps } from './steps/TrackSteps'
import { TrackVelocities } from './velocity/TrackVelocities'
import { ClearTrack } from './controls/ClearTrack'
import { ComponentType } from 'react'
import { Sampler } from '../core/Sampler'

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

const TrackContents: Record<string, ComponentType<{ sampler: Sampler }>> = {
  step: TrackSteps,
  velocity: TrackVelocities,
}

export function StepSequencer() {
  const samplers = useSequenceStore(state => state.samplers)
  const displayMode = useSequenceStore(state => state.displayMode)
  const TrackContent = TrackContents[displayMode]

  return (
    <section className='w-full py-4 lg:border lg:rounded-md bg-card'>
      <ul className='overflow-x-auto scrollbar'>
        {samplers.map(sampler => (
          <li key={sampler.meta.id} className='grid grid-cols-[1fr_3rem] group'>
            <div className='grid grid-cols-[13rem_1fr] lg:grid-cols-[20rem_1fr] border-b group-last:border-b-0'>
              <TrackHeader sampler={sampler} />
              <ShadowContainer>
                {TrackContent && <TrackContent sampler={sampler} />}
              </ShadowContainer>
            </div>
            <ClearTrack row={sampler.meta.position} />
          </li>
        ))}
      </ul>
    </section>
  )
}
