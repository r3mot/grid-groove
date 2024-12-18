import { cn } from '@/lib/utils'
import { useSequenceStore } from '@/providers/store/sequenceStore'
import { toggleVariants } from '@/components/ui/toggle'
import { HeadsetIcon } from '@/components/icons/Headset'

interface SoloChannelProps {
  id: string
}

export function SoloChannel({ id }: SoloChannelProps) {
  const soloIds = useSequenceStore(state => state.soloChannelIds)
  const toggleSolo = useSequenceStore(state => state.toggleSoloChannel)

  return (
    <button
      data-state={soloIds.has(id) ? 'on' : 'off'}
      onClick={() => toggleSolo(id)}
      className={cn(toggleVariants(), 'data-[state=on]:bg-blue-600')}
    >
      <HeadsetIcon />
    </button>
  )
}
