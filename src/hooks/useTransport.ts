import { useSequenceStore } from '@/providers/store/sequenceStore'

export function useTransport() {
  const transportState = useSequenceStore(state => state.playbackState)
  const setTransportState = useSequenceStore(state => state.setPlaybackState)

  async function start() {
    if (transportState !== 'started') {
      setTransportState('started')
    }
  }

  function stop() {
    if (transportState !== 'stopped') {
      setTransportState('stopped')
    }
  }

  function pause() {
    if (transportState !== 'paused') {
      setTransportState('paused')
    }
  }

  const isPlaying = transportState === 'started'
  const canPlay = transportState === 'paused' || transportState === 'stopped'

  return { start, stop, pause, transport: transportState, isPlaying, canPlay }
}
