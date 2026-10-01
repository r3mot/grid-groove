import { useSequenceStore } from '../sequenceStore'
import { Sampler } from '@/features/core/Sampler'
import { createStepsArray, createUniformArray } from '@/lib/test'
import { StepCount } from '@/types'

const { transport, MockSequence } = vi.hoisted(() => {
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
  const transport = {
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    bpm: { value: 0 },
  }
  return { transport, MockSequence }
})

vi.mock('tone', async importOriginal => ({
  ...(await importOriginal<typeof import('tone')>()),
  getTransport: () => transport,
  Sequence: MockSequence,
}))

const KICK = 0
const SNARE = 1
const TRACK_COUNT = 2

const STEP_COUNT: StepCount = 8
const LONG_STEP_COUNT: StepCount = 16

const FULL_VELOCITY = 1
const HALF_VELOCITY = 0.5
const SILENT_VELOCITY = 0

const AUDIO_TIME = 10

const DEFAULT_BPM = 120
const SAVED_BPM = 90

type ActiveSteps = Record<number, number[]>

const store = () => useSequenceStore.getState()

const fakeSampler = (id: string) => ({
  id,
  mute: false,
  triggerAttackRelease: vi.fn(),
})

const stepsGrid = (
  activeSteps: ActiveSteps = {},
  stepCount: StepCount = STEP_COUNT,
) => createStepsArray(TRACK_COUNT, stepCount, activeSteps)

const velocityGrid = (stepCount: StepCount = STEP_COUNT) =>
  createUniformArray(TRACK_COUNT, stepCount, FULL_VELOCITY)

function setup(activeSteps: ActiveSteps = {}) {
  const samplers = [fakeSampler('kick'), fakeSampler('snare')]
  useSequenceStore.setState({
    samplers: samplers as unknown as Sampler[],
    stepCount: STEP_COUNT,
    steps: stepsGrid(activeSteps),
    velocities: velocityGrid(),
  })
  return samplers
}

const setStep = (track: number, step: number, active = true) =>
  store().updateStep(step, track, active)

const setVelocity = (track: number, step: number, velocity: number) =>
  store().updateVelocity(velocity, step, track)

const currentSequence = () =>
  store().sequence as unknown as InstanceType<typeof MockSequence>

function buildSequence() {
  store().setStepCount(STEP_COUNT)
  return currentSequence()
}

const savedState = () =>
  JSON.parse(localStorage.getItem('sequencer-store') ?? '{}').state

const playStep = (step: number) => buildSequence().callback(AUDIO_TIME, step)

const expectPlayedAt = (
  sampler: ReturnType<typeof fakeSampler>,
  velocity: number,
) =>
  expect(sampler.triggerAttackRelease).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    AUDIO_TIME,
    velocity,
  )

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  transport.bpm.value = DEFAULT_BPM
})

describe('step and velocity actions', () => {
  it('updateStep toggles a single step', () => {
    setup()

    setStep(SNARE, 2)
    expect(store().steps).toEqual(stepsGrid({ [SNARE]: [2] }))

    setStep(SNARE, 2, false)
    expect(store().steps).toEqual(stepsGrid())
  })

  it.fails('updateStep does not mutate the previous steps', () => {
    setup()
    const previousSteps = store().steps

    setStep(KICK, 0)

    expect(previousSteps).toEqual(stepsGrid())
  })

  it('updateVelocity sets a single step', () => {
    setup()
    setVelocity(KICK, 3, HALF_VELOCITY)

    const expected = velocityGrid()
    expected[KICK][3] = HALF_VELOCITY
    expect(store().velocities).toEqual(expected)
  })

  it('clearStepRow resets only that track', () => {
    setup({ [KICK]: [0, 1], [SNARE]: [2] })
    setVelocity(SNARE, 2, HALF_VELOCITY)

    store().clearStepRow(SNARE)

    expect(store().steps).toEqual(stepsGrid({ [KICK]: [0, 1] }))
    expect(store().velocities).toEqual(velocityGrid())
  })

  it('clearSteps resets every track', () => {
    setup({ [KICK]: [0], [SNARE]: [3] })
    setVelocity(SNARE, 3, HALF_VELOCITY)

    store().clearSteps()

    expect(store().steps).toEqual(stepsGrid())
    expect(store().velocities).toEqual(velocityGrid())
  })

  it('setStepCount keeps steps when growing and drops steps past the end when shrinking', () => {
    setup({ [KICK]: [1, 6] })

    store().setStepCount(LONG_STEP_COUNT)
    expect(store().steps).toEqual(
      stepsGrid({ [KICK]: [1, 6] }, LONG_STEP_COUNT),
    )
    expect(store().velocities).toEqual(velocityGrid(LONG_STEP_COUNT))

    setStep(KICK, LONG_STEP_COUNT - 1)
    store().setStepCount(STEP_COUNT)
    expect(store().steps).toEqual(stepsGrid({ [KICK]: [1, 6] }))
  })
})

describe('sequence playback', () => {
  it('builds a sequence over every step at the current subdivision', () => {
    setup()
    const sequence = buildSequence()

    expect(sequence.events).toEqual([...Array(STEP_COUNT).keys()])
    expect(sequence.subdivision).toBe(store().subdivision)
  })

  it('plays only tracks active on the current step, at their velocity', () => {
    const [kick, snare] = setup({ [KICK]: [0], [SNARE]: [1] })
    setVelocity(KICK, 0, HALF_VELOCITY)

    playStep(0)

    expectPlayedAt(kick, HALF_VELOCITY)
    expect(snare.triggerAttackRelease).not.toHaveBeenCalled()
  })

  it.fails('plays a silent step at zero velocity', () => {
    const [kick] = setup({ [KICK]: [0] })
    setVelocity(KICK, 0, SILENT_VELOCITY)

    playStep(0)

    expectPlayedAt(kick, SILENT_VELOCITY)
  })

  it('setSubdivision rebuilds the sequence at the new subdivision', () => {
    setup()
    store().setSubdivision('8n')

    expect(currentSequence().subdivision).toBe('8n')
  })

  it('togglePlayback starts and stops the transport and sequence', () => {
    setup()
    const sequence = buildSequence()

    store().togglePlayback()
    expect(store().isPlaying).toBe(true)
    expect(transport.start).toHaveBeenCalled()
    expect(sequence.start).toHaveBeenCalled()

    store().togglePlayback()
    expect(store().isPlaying).toBe(false)
    expect(transport.stop).toHaveBeenCalled()
    expect(sequence.stop).toHaveBeenCalled()
  })

  it('pausing keeps the sequence position for resuming', () => {
    setup()
    const sequence = buildSequence()

    store().setPlaybackState('started')
    store().setPlaybackState('paused')

    expect(store().isPlaying).toBe(false)
    expect(transport.pause).toHaveBeenCalled()
    expect(sequence.stop).not.toHaveBeenCalled()
  })

  it.fails('saves the tempo with the beat', () => {
    setup()
    store().setPlaybackBPM(SAVED_BPM)

    expect(savedState().playbackBPM).toBe(SAVED_BPM)
  })

  it.fails('restores the saved tempo to the transport on load', async () => {
    localStorage.setItem(
      'sequencer-store',
      JSON.stringify({ state: { playbackBPM: SAVED_BPM }, version: 0 }),
    )

    await useSequenceStore.persist.rehydrate()

    expect(transport.bpm.value).toBe(SAVED_BPM)
  })
})

describe('mute and solo', () => {
  it('soloing a track mutes every other track', () => {
    const [kick, snare] = setup()

    store().toggleSoloChannel(kick.id)
    expect(kick.mute).toBe(false)
    expect(snare.mute).toBe(true)

    store().toggleSoloChannel(snare.id)
    expect(snare.mute).toBe(false)
  })

  it('clearing all solos unmutes every track', () => {
    const [kick, snare] = setup()

    store().toggleSoloChannel(kick.id)
    store().toggleSoloChannel(kick.id)

    expect(kick.mute).toBe(false)
    expect(snare.mute).toBe(false)
  })

  it.fails('clearing solo keeps a manually muted track muted', () => {
    const [kick, snare] = setup()
    kick.mute = true

    store().toggleSoloChannel(snare.id)
    store().toggleSoloChannel(snare.id)

    expect(kick.mute).toBe(true)
  })
})
