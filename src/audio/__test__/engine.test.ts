import { AudioEngine } from '../engine'
import { useMixerStore } from '@/stores/mixerStore'
import { usePatternStore } from '@/stores/patternStore'
import { useTransportStore } from '@/stores/transportStore'
import { createStepsArray, createUniformArray } from '@/lib/test'
import { Sample, StepCount } from '@/types'

const { transport, MockSequence, FakeSampler } = vi.hoisted(() => {
  class MockSequence {
    start = vi.fn()
    stop = vi.fn()
    dispose = vi.fn()
    constructor(
      public callback: (time: number, step: number) => void,
      public events: number[],
      public subdivision: string,
    ) {}
  }
  class FakeSampler {
    id: string
    soloMuted = false
    triggerAttackRelease = vi.fn()
    dispose = vi.fn()
    constructor(options: { sampleId: string }) {
      this.id = options.sampleId
    }
  }
  const transport = {
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    bpm: { value: 0 },
  }
  return { transport, MockSequence, FakeSampler }
})

vi.mock('tone', async importOriginal => ({
  ...(await importOriginal<typeof import('tone')>()),
  getTransport: () => transport,
  Sequence: MockSequence,
}))
vi.mock('@/features/core/Sampler', () => ({ Sampler: FakeSampler }))
vi.mock('@/features/core/MainBus', () => ({
  MainBus: class {
    dispose = vi.fn()
  },
}))
vi.mock('@/features/core/EffectBus', () => ({ EffectBus: class {} }))

const KICK = 0
const SNARE = 1

const STEP_COUNT: StepCount = 8
const LONG_STEP_COUNT: StepCount = 16

const FULL_VELOCITY = 1
const HALF_VELOCITY = 0.5
const SILENT_VELOCITY = 0

const AUDIO_TIME = 10
const SAVED_BPM = 90

const samples: Sample[] = [
  { id: 'kick', name: 'kick', url: '/kick.wav', color: 'red' },
  { id: 'snare', name: 'snare', url: '/snare.wav', color: 'blue' },
]

let engine: AudioEngine

const pattern = () => usePatternStore.getState()
const transportStore = () => useTransportStore.getState()

const sequence = () =>
  engine['sequence'] as unknown as InstanceType<typeof MockSequence>

const samplers = () =>
  engine.samplers as unknown as InstanceType<typeof FakeSampler>[]

const playStep = (step: number) => sequence().callback(AUDIO_TIME, step)

const expectPlayedAt = (
  sampler: InstanceType<typeof FakeSampler>,
  velocity: number,
) =>
  expect(sampler.triggerAttackRelease).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    AUDIO_TIME,
    velocity,
  )

function setup(activeSteps: Record<number, number[]> = {}) {
  usePatternStore.setState({
    stepCount: STEP_COUNT,
    subdivision: '16n',
    steps: createStepsArray(samples.length, STEP_COUNT, activeSteps),
    velocities: createUniformArray(samples.length, STEP_COUNT, FULL_VELOCITY),
  })
  engine = new AudioEngine()
  engine.init(samples)
  return samplers()
}

beforeEach(() => {
  vi.clearAllMocks()
  useTransportStore.setState({ playbackState: 'stopped', bpm: 120 })
  useMixerStore.setState({ soloIds: new Set() })
})

afterEach(() => {
  engine?.dispose()
})

describe('init', () => {
  it('creates a sampler per sample, in order', () => {
    setup()
    expect(engine.samplers.map(s => s.id)).toEqual(['kick', 'snare'])
    expect(engine.getSampler('snare')).toBe(engine.samplers[SNARE])
  })

  it('throws without samples', () => {
    engine = new AudioEngine()
    expect(() => engine.init([])).toThrow('No samples loaded')
  })

  it('applies the saved tempo to the transport', () => {
    useTransportStore.setState({ bpm: SAVED_BPM })
    setup()
    expect(transport.bpm.value).toBe(SAVED_BPM)
  })
})

describe('sequence playback', () => {
  it('builds a sequence over every step at the current subdivision', () => {
    setup()

    expect(sequence().events).toEqual([...Array(STEP_COUNT).keys()])
    expect(sequence().subdivision).toBe('16n')
  })

  it('plays only tracks active on the current step, at their velocity', () => {
    const [kick, snare] = setup({ [KICK]: [0], [SNARE]: [1] })
    pattern().setVelocity(KICK, 0, HALF_VELOCITY)

    playStep(0)

    expectPlayedAt(kick, HALF_VELOCITY)
    expect(snare.triggerAttackRelease).not.toHaveBeenCalled()
  })

  it('plays a silent step at zero velocity', () => {
    const [kick] = setup({ [KICK]: [0] })
    pattern().setVelocity(KICK, 0, SILENT_VELOCITY)

    playStep(0)

    expectPlayedAt(kick, SILENT_VELOCITY)
  })

  it('hears steps edited after the sequence was built', () => {
    const [kick] = setup()
    pattern().setStep(KICK, 2, true)

    playStep(2)

    expectPlayedAt(kick, FULL_VELOCITY)
  })

  it('rebuilds the sequence when the subdivision changes', () => {
    setup()
    const previous = sequence()

    pattern().setSubdivision('8n')

    expect(previous.dispose).toHaveBeenCalled()
    expect(sequence().subdivision).toBe('8n')
  })

  it('stops playback and rebuilds the sequence when the step count changes', () => {
    setup()
    transportStore().setPlaybackState('started')
    const previous = sequence()

    pattern().setStepCount(LONG_STEP_COUNT)

    expect(transportStore().playbackState).toBe('stopped')
    expect(transport.stop).toHaveBeenCalled()
    expect(previous.dispose).toHaveBeenCalled()
    expect(sequence().events).toHaveLength(LONG_STEP_COUNT)
    expect(sequence().start).toHaveBeenCalledWith(0)
  })

  it('ignores pattern edits that do not change the timing', () => {
    setup()
    const previous = sequence()

    pattern().setStep(KICK, 0, true)

    expect(sequence()).toBe(previous)
  })
})

describe('transport', () => {
  it('pins the sequence to the start of the transport timeline', () => {
    setup()
    expect(sequence().start).toHaveBeenCalledWith(0)
  })

  it('togglePlayback starts and stops only the transport', () => {
    setup()

    transportStore().togglePlayback()
    expect(transport.start).toHaveBeenCalled()

    transportStore().togglePlayback()
    expect(transport.stop).toHaveBeenCalled()

    // starting/stopping the sequence at "now" right after the transport
    // changes state can throw a negative-time RangeError in Tone
    expect(sequence().start).toHaveBeenCalledTimes(1)
    expect(sequence().stop).not.toHaveBeenCalled()
  })

  it('pausing keeps the sequence position for resuming', () => {
    setup()

    transportStore().setPlaybackState('started')
    transportStore().setPlaybackState('paused')

    expect(transport.pause).toHaveBeenCalled()
    expect(sequence().stop).not.toHaveBeenCalled()
  })

  it('applies tempo changes to the transport', () => {
    setup()
    transportStore().setBpm(SAVED_BPM)
    expect(transport.bpm.value).toBe(SAVED_BPM)
  })

  it('stops reacting to stores once disposed', () => {
    setup()
    engine.dispose()

    transportStore().setPlaybackState('started')

    expect(transport.start).not.toHaveBeenCalled()
  })
})

describe('solo', () => {
  const toggleSolo = (id: string) => useMixerStore.getState().toggleSolo(id)

  it('soloing a track silences every other track', () => {
    const [kick, snare] = setup()

    toggleSolo(kick.id)
    expect(kick.soloMuted).toBe(false)
    expect(snare.soloMuted).toBe(true)

    toggleSolo(snare.id)
    expect(snare.soloMuted).toBe(false)
  })

  it('clearing all solos un-silences every track', () => {
    const [kick, snare] = setup()

    toggleSolo(kick.id)
    toggleSolo(kick.id)

    expect(kick.soloMuted).toBe(false)
    expect(snare.soloMuted).toBe(false)
  })

  it('applies solos made before init', () => {
    useMixerStore.setState({ soloIds: new Set(['kick']) })
    const [kick, snare] = setup()

    expect(kick.soloMuted).toBe(false)
    expect(snare.soloMuted).toBe(true)
  })
})
