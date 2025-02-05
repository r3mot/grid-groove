import { useSampleStore } from '../sampleStore'
import { COLORS } from '@/lib/color'
describe('useSampleStore', () => {
  it('should initialize with precomputed samples', () => {
    const { samples, maxSamples } = useSampleStore.getState()

    expect(samples).toHaveLength(8) // Ensure all sample paths are loaded
    expect(samples[0]).toMatchObject({
      id: 'clhat',
      name: 'clhat',
      url: '/audio/clhat.wav',
      color: COLORS[0],
    })
    expect(maxSamples).toBe(8)
  })

  it('should add a new sample', () => {
    const newSample = {
      id: 'newSample',
      name: 'New Sample',
      url: '/audio/newSample.wav',
      color: COLORS[8],
    }
    useSampleStore.getState().addSample(newSample)

    const { samples } = useSampleStore.getState()
    expect(samples).toContainEqual(newSample)
    expect(samples).toHaveLength(9) // Original 8 + 1 new sample
  })
})
