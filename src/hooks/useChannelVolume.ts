import { useEffect, useState } from 'react'
import { Channel, dbToGain, gainToDb } from 'tone'

export function useChannelVolume(channel: Channel | Channel[]) {
  const [volume, setVolume] = useState(() =>
    dbToGain(
      Array.isArray(channel) ? channel[0].volume.value : channel.volume.value,
    ),
  )

  useEffect(() => {
    if (Array.isArray(channel)) {
      channel.forEach(ch => {
        ch.volume.value = gainToDb(volume)
      })
    } else {
      channel.volume.value = gainToDb(volume)
    }
  }, [volume, channel])

  return [volume, setVolume] as const
}
