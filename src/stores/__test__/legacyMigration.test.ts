const legacyState = {
  stepCount: 32,
  subdivision: '8n',
  displayMode: 'velocity',
  steps: [[true, false]],
  velocities: [[0.5, 1]],
  isClearWarningRead: true,
  playbackBPM: 90,
}

beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
})

it('seeds the split stores from the old sequencer-store', async () => {
  localStorage.setItem(
    'sequencer-store',
    JSON.stringify({ state: legacyState, version: 0 }),
  )

  const { usePatternStore } = await import('../patternStore')
  const { useTransportStore } = await import('../transportStore')
  const { useUIStore } = await import('../uiStore')

  expect(usePatternStore.getState()).toMatchObject({
    stepCount: 32,
    subdivision: '8n',
    steps: [[true, false]],
    velocities: [[0.5, 1]],
  })
  expect(useTransportStore.getState().bpm).toBe(90)
  expect(useUIStore.getState()).toMatchObject({
    displayMode: 'velocity',
    isClearWarningRead: true,
  })
})

it('prefers a store’s own saved state over the old one', async () => {
  localStorage.setItem(
    'sequencer-store',
    JSON.stringify({ state: legacyState, version: 0 }),
  )
  localStorage.setItem(
    'transport-store',
    JSON.stringify({ state: { bpm: 140 }, version: 0 }),
  )

  const { useTransportStore } = await import('../transportStore')

  expect(useTransportStore.getState().bpm).toBe(140)
})

it('uses defaults when nothing was saved', async () => {
  const { usePatternStore } = await import('../patternStore')
  const { useTransportStore } = await import('../transportStore')

  expect(usePatternStore.getState().stepCount).toBe(16)
  expect(useTransportStore.getState().bpm).toBe(120)
})
