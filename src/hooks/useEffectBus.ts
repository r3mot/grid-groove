import { audioEngine } from '@/audio/engine'
import { useState } from 'react'
import { Channel } from 'tone'

export function useEffectBus(source: Channel) {
  const [isConnected, setIsConnected] = useState(false)

  function recieve() {
    audioEngine.effectBus.route(source)
    setIsConnected(true)
  }

  function remove() {
    audioEngine.effectBus.unroute(source)
    setIsConnected(false)
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
