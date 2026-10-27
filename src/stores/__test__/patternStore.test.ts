import { usePatternStore } from '../patternStore'
import { createStepsArray, createUniformArray } from '@/lib/test'
import { StepCount } from '@/types'

const KICK = 0
const SNARE = 1
const TRACK_COUNT = 2

const STEP_COUNT: StepCount = 8
const LONG_STEP_COUNT: StepCount = 16

const FULL_VELOCITY = 1
const HALF_VELOCITY = 0.5

type ActiveSteps = Record<number, number[]>

const store = () => usePatternStore.getState()

const stepsGrid = (
  activeSteps: ActiveSteps = {},
  stepCount: StepCount = STEP_COUNT,
) => createStepsArray(TRACK_COUNT, stepCount, activeSteps)

const velocityGrid = (stepCount: StepCount = STEP_COUNT) =>
  createUniformArray(TRACK_COUNT, stepCount, FULL_VELOCITY)

function setup(activeSteps: ActiveSteps = {}) {
  usePatternStore.setState({
    stepCount: STEP_COUNT,
    steps: stepsGrid(activeSteps),
    velocities: velocityGrid(),
  })
}

const savedState = () =>
  JSON.parse(localStorage.getItem('pattern-store') ?? '{}').state

beforeEach(() => {
  localStorage.clear()
})

describe('steps and velocities', () => {
  it('setStep toggles a single step', () => {
    setup()

    store().setStep(SNARE, 2, true)
    expect(store().steps).toEqual(stepsGrid({ [SNARE]: [2] }))

    store().setStep(SNARE, 2, false)
    expect(store().steps).toEqual(stepsGrid())
  })

  it('setStep does not mutate the previous steps', () => {
    setup()
    const previousSteps = store().steps

    store().setStep(KICK, 0, true)

    expect(previousSteps).toEqual(stepsGrid())
  })

  it('setVelocity sets a single step', () => {
    setup()
    store().setVelocity(KICK, 3, HALF_VELOCITY)

    const expected = velocityGrid()
    expected[KICK][3] = HALF_VELOCITY
    expect(store().velocities).toEqual(expected)
  })

  it('clearStepRow resets only that track', () => {
    setup({ [KICK]: [0, 1], [SNARE]: [2] })
    store().setVelocity(SNARE, 2, HALF_VELOCITY)

    store().clearStepRow(SNARE)

    expect(store().steps).toEqual(stepsGrid({ [KICK]: [0, 1] }))
    expect(store().velocities).toEqual(velocityGrid())
  })

  it('clearSteps resets every track', () => {
    setup({ [KICK]: [0], [SNARE]: [3] })
    store().setVelocity(SNARE, 3, HALF_VELOCITY)

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

    store().setStep(KICK, LONG_STEP_COUNT - 1, true)
    store().setStepCount(STEP_COUNT)
    expect(store().steps).toEqual(stepsGrid({ [KICK]: [1, 6] }))
  })
})

describe('ensureTracks', () => {
  it('creates empty rows when there is no saved pattern', () => {
    usePatternStore.setState({
      stepCount: STEP_COUNT,
      steps: [],
      velocities: [],
    })

    store().ensureTracks(TRACK_COUNT)

    expect(store().steps).toEqual(stepsGrid())
    expect(store().velocities).toEqual(velocityGrid())
  })

  it('keeps saved steps and fits rows to the step count', () => {
    usePatternStore.setState({
      stepCount: STEP_COUNT,
      steps: [
        [true, false],
        [false, true],
      ],
      velocities: [[HALF_VELOCITY], []],
    })

    store().ensureTracks(TRACK_COUNT)

    expect(store().steps).toEqual(stepsGrid({ [KICK]: [0], [SNARE]: [1] }))
    expect(store().velocities[KICK][0]).toBe(HALF_VELOCITY)
    expect(store().velocities[SNARE]).toHaveLength(STEP_COUNT)
  })
})

it('saves the pattern', () => {
  setup()
  store().setStep(KICK, 0, true)

  expect(savedState().steps).toEqual(stepsGrid({ [KICK]: [0] }))
})
