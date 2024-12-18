import { toggleVariants } from '@/components/ui/toggle'
import { SpeakerIcon } from '@/components/icons/Speaker'
import { SpeakerOffIcon } from '@/components/icons/SpeakerOff'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Channel } from 'tone'

interface MuteChannelProps {
  channel: Channel
}

export function MuteChannel({ channel }: MuteChannelProps) {
  const [muted, setMuted] = useState(
    () => channel.mute || channel.volume.value === -Infinity,
  )

  useEffect(() => {
    const syncMuteState = () => {
      setMuted(channel.mute || channel.volume.value === -Infinity)
    }

    // Polling interval to check mute state
    const interval = setInterval(syncMuteState, 100)
    return () => clearInterval(interval)
  }, [channel])

  const toggleMute = () => {
    const newMuteState = !muted

    channel.mute = newMuteState
    if (!newMuteState && channel.volume.value === -Infinity) {
      channel.volume.value = 0
    }

    setMuted(newMuteState)
  }

  return (
    <button
      aria-live='polite'
      data-state={muted ? 'on' : 'off'}
      onClick={toggleMute}
      className={cn(toggleVariants(), 'data-[state=on]:bg-red-500')}
    >
      {muted ? (
        <SpeakerOffIcon data-testid='speaker-muted-icon' />
      ) : (
        <SpeakerIcon data-testid='speaker-icon' />
      )}
    </button>
  )
}
