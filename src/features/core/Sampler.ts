import { DECIBEL_RANGE } from '@/lib/constants'
import { Channel, Meter, Sampler as ToneSampler } from 'tone'
import { MainBus } from './MainBus'
import { immerable } from 'immer'
import { DisplayColor } from '@/types'

interface SamplerOptions {
  sampleId: string
  sampleUrl: string
  sampleName: string
  sampleColor: DisplayColor
  mainBus: MainBus
  position: number
}

interface SampleMetadata {
  id: string
  name: string
  url: string
  color: DisplayColor
  position: number
}

export class Sampler extends ToneSampler {
  [immerable] = true

  private readonly samplerChannel: Channel
  private readonly peakMeter: Meter
  private readonly mainBus: MainBus

  private soloed: boolean = false
  private muted: boolean = false

  private readonly metadata: SampleMetadata

  constructor(options: SamplerOptions) {
    super({
      urls: { C4: options.sampleUrl },
      onerror: () => console.error('Cannot load sample:', options.sampleUrl),
    })

    this.metadata = {
      id: options.sampleId,
      name: options.sampleName,
      url: options.sampleUrl,
      color: options.sampleColor,
      position: options.position,
    }

    this.mainBus = options.mainBus

    this.peakMeter = new Meter({ channelCount: 2 })
    this.samplerChannel = new Channel({
      channelCount: 2,
      volume: DECIBEL_RANGE.defaultDb,
    })

    this.samplerChannel.chain(this.peakMeter, this.mainBus)
    this.connect(this.samplerChannel)
  }

  get id(): string {
    return this.metadata.id
  }

  get sampleName(): string {
    return this.metadata.name
  }

  get color(): DisplayColor | undefined {
    return this.metadata.color
  }

  get meter(): Meter {
    return this.peakMeter
  }

  get meterValues(): number[] | number {
    return this.peakMeter.getValue()
  }

  get channel(): Channel {
    return this.samplerChannel
  }

  get solo(): boolean {
    return this.soloed
  }

  get mute(): boolean {
    return this.muted
  }

  get meta(): SampleMetadata {
    return this.metadata
  }

  set pan(value: number) {
    this.samplerChannel.pan.value = value
  }

  set mute(enabled: boolean) {
    this.samplerChannel.mute = enabled
    this.muted = enabled
  }
}
