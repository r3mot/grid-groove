import { Channel, Chorus, Gain, Meter, Reverb } from 'tone'
import { immerable } from 'immer'
import { DECIBEL_RANGE } from '@/lib/constants'

export class EffectBus {
  [immerable] = true
  private reverb: Reverb
  private chorus: Chorus
  private reverbChannel: Channel
  private chorusChannel: Channel
  private busChannel: Channel
  private connectedSources: Map<Channel, Gain<'decibels'>[]>
  private peakMeter: Meter

  constructor() {
    this.reverb = new Reverb(3)
    this.chorus = new Chorus({ wet: 1 }).start()

    this.reverbChannel = new Channel().receive('reverb')
    this.chorusChannel = new Channel().receive('chorus')

    this.busChannel = new Channel({
      volume: DECIBEL_RANGE.minDb,
      pan: 0,
      channelCount: 2,
    }).toDestination()

    this.peakMeter = new Meter({ channelCount: 2 })

    this.reverbChannel.chain(this.reverb, this.busChannel)
    this.chorusChannel.chain(this.chorus, this.busChannel)
    this.busChannel.chain(this.peakMeter)

    this.connectedSources = new Map()
  }

  get meter() {
    return this.peakMeter
  }

  get meterValues() {
    return this.peakMeter.getValue()
  }

  get channel() {
    return this.busChannel
  }

  get sources() {
    return Array.from(this.connectedSources.keys())
  }

  set volume(value: number) {
    this.busChannel.volume.value = value
  }

  set pan(value: number) {
    this.busChannel.pan.value = value
  }

  toggleReverb() {
    this.reverb.wet.value = this.reverb.wet.value < 1 ? 1 : 0
  }

  toggleChorus() {
    this.chorus.wet.value = this.chorus.wet.value < 1 ? 1 : 0
  }

  route(source: Channel) {
    if (!this.connectedSources.has(source)) {
      const sourceNodes = [source.send('reverb'), source.send('chorus')]
      this.connectedSources.set(source, sourceNodes)
      return sourceNodes
    }
    return this.connectedSources.get(source)
  }

  unroute(source: Channel) {
    const sourceNodes = this.connectedSources.get(source)
    if (sourceNodes) {
      sourceNodes.forEach(node => node.dispose())
      this.connectedSources.delete(source)
    }
  }
}
