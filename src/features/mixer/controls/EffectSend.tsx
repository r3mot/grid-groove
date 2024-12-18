import { useEffectBus } from '@/hooks/useEffectBus'
import { cn } from '@/lib/utils'
import { Channel } from 'tone'

export function EffectSend({ source }: { source: Channel }) {
  const { isConnected, toggleConnection } = useEffectBus(source)

  return (
    <button
      onClick={toggleConnection}
      className={cn(
        isConnected ? 'bg-blue-950 text-white' : 'bg-secondary border',
        'w-full py-1 mt-5 text-sm font-semibold text-center border rounded-sm',
      )}
    >
      Send
    </button>
  )
}
