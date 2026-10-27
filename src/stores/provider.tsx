import { audioEngine } from '@/audio/engine'
import { useSampleStore } from './sampleStore'
import { usePatternStore } from './patternStore'
import { useEffect, useState } from 'react'

type Status = 'loading' | 'ready' | 'error'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>(() =>
    audioEngine.isReady ? 'ready' : 'loading',
  )

  useEffect(() => {
    if (audioEngine.isReady) return

    try {
      const { samples } = useSampleStore.getState()
      usePatternStore.getState().ensureTracks(samples.length)
      audioEngine.init(samples)
      setStatus('ready')
    } catch (error) {
      console.error('Failed to start audio engine:', error)
      setStatus('error')
    }
  }, [])

  if (status === 'error') {
    return <div>Something went wrong loading the sequencer.</div>
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
