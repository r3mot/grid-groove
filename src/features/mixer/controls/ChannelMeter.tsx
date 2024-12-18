import { useCallback, useEffect, useState } from 'react'
import { Meter } from 'tone'

interface ChannelMeterProps {
  meter: Meter
  height?: number
}

export function ChannelMeter({ meter, height = 100 }: ChannelMeterProps) {
  const [signal, setSignal] = useState<number[]>([])

  const updateSignal = useCallback(
    () => setSignal([...(meter.getValue() as number[])]),
    [meter],
  )

  useEffect(() => {
    if (!meter) return
    meter.normalRange = true
    const frequency = 30
    const interval = setInterval(updateSignal, frequency)

    return () => clearInterval(interval)
  }, [meter, updateSignal])

  return (
    <div
      className='w-4 overflow-hidden rounded-sm bg-background/60'
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        height: `${height}px`,
      }}
    >
      {signal &&
        signal.slice(0, 32).map((value, index) => (
          <div
            key={`meter-${index}`}
            style={{
              flex: 1,
              backgroundColor:
                value > 0.7 ? 'red' : value > 0.6 ? 'yellow' : 'green',
              height: `${value ** 0.2 * height}px`,
              margin: '1px',
            }}
          />
        ))}
    </div>
  )
}
