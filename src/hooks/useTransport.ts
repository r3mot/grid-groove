import { useTransportStore } from '@/stores/transportStore'

export function useTransport() {
  const transportState = useTransportStore(state => state.playbackState)
  const setTransportState = useTransportStore(state => state.setPlaybackState)

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
