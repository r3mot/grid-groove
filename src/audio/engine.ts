import { useMixerStore } from '@/stores/mixerStore'
import { usePatternStore } from '@/stores/patternStore'
import { useTransportStore } from '@/stores/transportStore'
import { Sample } from '@/types'
import { PlaybackState, Sequence, getTransport } from 'tone'
import { EffectBus } from '@/features/core/EffectBus'
import { MainBus } from '@/features/core/MainBus'
import { Sampler } from '@/features/core/Sampler'

/**
 * Owns every Tone object: buses, samplers, the step sequence and the transport.
 *
 * Stores hold plain data and never touch Tone. The engine subscribes to them
 * and keeps the audio graph in sync, so data only flows stores -> engine.
 * The graph is built once in `init` and never replaced, so components can read
 * it directly without subscribing.
 */
export class AudioEngine {
  private _mainBus: MainBus | null = null
  private _effectBus: EffectBus | null = null
  private _samplers: Sampler[] = []
  private sequence: Sequence | null = null
  private unsubscribers: (() => void)[] = []

  get isReady(): boolean {
    return this._mainBus !== null
  }

  get mainBus(): MainBus {
    if (!this._mainBus) throw new Error('AudioEngine not initialized')
    return this._mainBus
  }

  get effectBus(): EffectBus {
    if (!this._effectBus) throw new Error('AudioEngine not initialized')
    return this._effectBus
  }

  get samplers(): readonly Sampler[] {
    return this._samplers
  }

  getSampler(id: string): Sampler | undefined {
    return this._samplers.find(sampler => sampler.id === id)
  }

  init(samples: Sample[]) {
    if (this.isReady) return
    if (samples.length === 0) throw new Error('No samples loaded')

    const mainBus = new MainBus()
    this._mainBus = mainBus
    this._effectBus = new EffectBus()
    this._samplers = samples.map(
      (sample, position) =>
        new Sampler({
          sampleId: sample.id,
          sampleUrl: sample.url,
          sampleName: sample.name,
          position,
          mainBus,
        }),
    )

    this.buildSequence()
    this.applyBpm(useTransportStore.getState().bpm)
    this.applySolo(useMixerStore.getState().soloIds)
    this.subscribe()
  }

  dispose() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe())
    this.unsubscribers = []
    this.sequence?.dispose()
    this._samplers.forEach(sampler => sampler.dispose())
    this._mainBus?.dispose()

    this.sequence = null
    this._samplers = []
    this._mainBus = null
    this._effectBus = null
  }

  private subscribe() {
    this.unsubscribers.push(
      useTransportStore.subscribe((state, prev) => {
        if (state.playbackState !== prev.playbackState) {
          this.applyPlaybackState(state.playbackState)
        }
        if (state.bpm !== prev.bpm) this.applyBpm(state.bpm)
      }),

      usePatternStore.subscribe((state, prev) => {
        if (
          state.stepCount !== prev.stepCount ||
          state.subdivision !== prev.subdivision
        ) {
          useTransportStore.getState().setPlaybackState('stopped')
          this.buildSequence()
        }
      }),

      useMixerStore.subscribe((state, prev) => {
        if (state.soloIds !== prev.soloIds) this.applySolo(state.soloIds)
      }),
    )
  }

  private buildSequence() {
    this.sequence?.dispose()

    const { stepCount, subdivision } = usePatternStore.getState()
    this.sequence = new Sequence(
      (time, step) => this.playStep(time, step),
      Array.from({ length: stepCount }, (_, i) => i),
      subdivision,
    )
    // stopping the sequence at "now" right after the transport changes state
    // can compute a tiny negative tick and throw.
    this.sequence.start(0)
  }

  private playStep(time: number, step: number) {
    const { steps, velocities } = usePatternStore.getState()

    this._samplers.forEach((sampler, row) => {
      if (steps[row]?.[step]) {
        const velocity = velocities[row]?.[step] ?? 1
        sampler.triggerAttackRelease('C4', '2n', time, velocity)
      }
    })
  }

  private applyPlaybackState(state: PlaybackState) {
    const transport = getTransport()

    if (state === 'started') transport.start()
    else if (state === 'paused') transport.pause()
    else transport.stop()
  }

  private applyBpm(bpm: number) {
    getTransport().bpm.value = bpm
  }

  // tonejs native solo only allows a single channel pass thru, so each
  // sampler has its own solo gate
  private applySolo(soloIds: Set<string>) {
    this._samplers.forEach(sampler => {
      sampler.soloMuted = soloIds.size > 0 && !soloIds.has(sampler.id)
    })
  }
}

export const audioEngine = new AudioEngine()
