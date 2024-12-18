import { Fader } from '@/components/fader/Fader'
import { useState } from 'react'
import { Channel } from 'tone'

interface ChannelFaderProps {
  channel: Channel
  minDb?: number
  maxDb?: number
  height?: number
}

export function ChannelFader({ channel, ...props }: ChannelFaderProps) {
  const [volume, setVolume] = useState(channel.volume.value)

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    channel.volume.value = newVolume
  }

  return <Fader valueDb={volume} onChange={handleVolumeChange} {...props} />
}
