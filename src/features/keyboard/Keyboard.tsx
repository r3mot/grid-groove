import { KeyboardKeys } from './KeyboardKeys'
import { KeyboardControls } from './KeyboardControls'
import { useSynthesizer } from '@/hooks/useSynthesizer'

export function Keyboard() {
  const synth = useSynthesizer()
  return (
    <article className='flex items-center w-full max-w-5xl p-2 px-8 border rounded-md select-none border-left bg-card'>
      <div className='w-full mx-auto space-y-4'>
        <div className='flex justify-center min-h-12'>
          <KeyboardControls />
        </div>
        <KeyboardKeys synth={synth} />
      </div>
    </article>
  )
}
