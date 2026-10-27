import { cn } from '@/lib/utils'
import { useMixerStore } from '@/stores/mixerStore'
import { toggleVariants } from '@/components/ui/toggle'
import { HeadsetIcon } from '@/components/icons/Headset'

interface SoloChannelProps {
  id: string
}

export function SoloChannel({ id }: SoloChannelProps) {
  const isSoloed = useMixerStore(state => state.soloIds.has(id))
  const toggleSolo = useMixerStore(state => state.toggleSolo)

  return (
    <button
      data-state={isSoloed ? 'on' : 'off'}
      onClick={() => toggleSolo(id)}
      className={cn(toggleVariants(), 'data-[state=on]:bg-blue-600')}
    >
      <HeadsetIcon />
    </button>
  )
}
