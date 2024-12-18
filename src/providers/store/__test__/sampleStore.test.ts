import { useSampleStore } from '../sampleStore'
describe('useSampleStore', () => {
  it('should initialize with precomputed samples', () => {
    const { samples, maxSamples } = useSampleStore.getState()

    expect(samples).toHaveLength(8) // Ensure all sample paths are loaded
    expect(samples[0]).toMatchObject({
      id: 'clhat',
      name: 'clhat',
      url: '/audio/clhat.wav',
      color: {
        contrast: 'rgba(51,255,51,0.2)',
        muted: 'rgba(51,255,51,0.5)',
        primary: 'rgba(51,255,51,1)',
      },
    })
    expect(maxSamples).toBe(8)
  })

  it('should add a new sample', () => {
    const newSample = {
      id: 'newSample',
      name: 'New Sample',
      url: '/audio/newSample.wav',
      color: { primary: '#fff', muted: '#aaa', contrast: '#000' },
    }
    useSampleStore.getState().addSample(newSample)

    const { samples } = useSampleStore.getState()
    expect(samples).toContainEqual(newSample)
    expect(samples).toHaveLength(9) // Original 8 + 1 new sample
  })

  it('should update an existing sample', () => {
    const updatedSample = { id: 'clhat', name: 'Updated Clhat' }
    useSampleStore.getState().updateSample(updatedSample)

    const { samples } = useSampleStore.getState()
    expect(samples.find(s => s.id === 'clhat')).toMatchObject(updatedSample)
  })
})
