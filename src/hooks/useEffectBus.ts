import { useSequenceStore } from '@/providers/store/sequenceStore'
import { useState } from 'react'
import { Channel } from 'tone'

export function useEffectBus(source: Channel) {
  const [isConnected, setIsConnected] = useState(false)
  const effectBus = useSequenceStore(state => state.effectBus)

  function recieve() {
    if (effectBus) {
      effectBus.route(source)
      setIsConnected(true)
    }
  }

  function remove() {
    if (effectBus) {
      effectBus.unroute(source)
      setIsConnected(false)
    }
  }

  function toggleConnection() {
    if (isConnected) {
      remove()
    } else {
      recieve()
    }
  }

  return { isConnected, toggleConnection }
}
