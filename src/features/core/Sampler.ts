import { DECIBEL_RANGE } from '@/lib/constants'
import { Channel, Meter, Sampler as ToneSampler, Volume } from 'tone'
import { MainBus } from './MainBus'
import { immerable } from 'immer'

interface SamplerOptions {
  sampleId: string
  sampleUrl: string
  sampleName: string
  mainBus: MainBus
  position: number
}

interface SampleMetadata {
  id: string
  name: string
  url: string
  position: number
}

export class Sampler extends ToneSampler {
  [immerable] = true

  private readonly samplerChannel: Channel
  private readonly peakMeter: Meter
  private readonly mainBus: MainBus
  private readonly soloGate: Volume

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
      position: options.position,
    }

    this.mainBus = options.mainBus

    this.peakMeter = new Meter({ channelCount: 2 })
    this.samplerChannel = new Channel({
      channelCount: 2,
      volume: DECIBEL_RANGE.defaultDb,
    })

    // tonejs native solo only allows a single channel pass thru
    // which will silence our main bus, so solo has its own gate
    this.soloGate = new Volume()

    this.chain(this.soloGate, this.samplerChannel, this.peakMeter, this.mainBus)
  }

  get id(): string {
    return this.metadata.id
  }

  get sampleName(): string {
    return this.metadata.name
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

  get soloMuted(): boolean {
    return this.soloGate.mute
  }

  get meta(): SampleMetadata {
    return this.metadata
  }

  set pan(value: number) {
    this.samplerChannel.pan.value = value
  }

  set soloMuted(muted: boolean) {
    this.soloGate.mute = muted
  }
}
