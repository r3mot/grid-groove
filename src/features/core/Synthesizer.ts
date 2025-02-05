import { EffectPreset } from '@/stores/presetStore'
import {
  Chorus,
  Distortion,
  getDestination,
  MonoSynth,
  MonoSynthOptions,
  PingPongDelay,
  PolySynth,
  Reverb,
} from 'tone'
import { RecursivePartial } from 'tone/build/esm/core/util/Interface'

type SynthOptions = RecursivePartial<
  Omit<MonoSynthOptions, 'context' | 'onsilence'>
>

interface SynthesizerOptions {
  options: SynthOptions
  effectConfig: EffectPreset
  presetName: string
}

export class Synthesizer extends PolySynth<MonoSynth> {
  private reverb: Reverb
  private chorus: Chorus
  private delay: PingPongDelay
  private distortion: Distortion

  constructor({ effectConfig, presetName, options }: SynthesizerOptions) {
    super(options)
    this.reverb = new Reverb(effectConfig.reverb)
    this.chorus = new Chorus(effectConfig.chorus)
    this.delay = new PingPongDelay(effectConfig.delay)
    this.distortion = new Distortion(effectConfig.distortion)

    this.bindEffects(presetName)
  }

  private bindEffects(presetName: string = 'default') {
    if (presetName !== 'default') {
      this.chain(
        this.chorus,
        this.delay,
        this.reverb,
        this.distortion,
        getDestination(),
      )
    } else {
      this.chain(this.reverb, getDestination())
    }
  }

  public destroy() {
    this.reverb.dispose()
    this.chorus.dispose()
    this.delay.dispose()
    this.distortion.dispose()
    this.disconnect()
    super.dispose()
  }
}
