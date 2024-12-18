import { immerable } from 'immer'
import { Channel, Meter, getDestination } from 'tone'

export class MainBus extends Channel {
  [immerable] = true
  private peakMeter: Meter

  constructor() {
    super({ channelCount: 2, volume: -6 })
    this.peakMeter = new Meter({ channelCount: 2 })
    this.chain(this.peakMeter, getDestination())
  }

  get meter(): Meter {
    return this.peakMeter
  }

  get meterValue(): number[] | number {
    return this.peakMeter.getValue()
  }
}
