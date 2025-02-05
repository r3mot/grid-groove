import { useSampleStore } from './sampleStore'
import { useSequenceStore } from './sequenceStore'
import { useEffect } from 'react'

/**
 *
 * TODO: Get good. This is hacky but works for now.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const sequenceInitialized = useSequenceStore(
    state => state.isSequenceInitialized,
  )
  const initialize = useSequenceStore(state => state.initialize)
  const initializeSamples = useSampleStore(state => state.initialize)

  useEffect(() => {
    async function setup() {
      initializeSamples()
      await initialize()
    }

    if (!sequenceInitialized) {
      setup()
    }
  }, [sequenceInitialized, initialize, initializeSamples])

  if (!sequenceInitialized) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
