import { render, screen } from '@testing-library/react'
import { SpectrumAnalyser } from './SpectrumAnalyser'
import { FFT, getDestination } from 'tone'

vi.mock('tone', async () => {
  const actual = await vi.importActual<typeof import('tone')>('tone')

  const MockFFT = vi.fn().mockImplementation(function () {
    return {
      getValue: vi.fn(() => new Array(64).fill(-50)),
      dispose: vi.fn(function (this: { disposed: boolean }) {
        this.disposed = true
      }),
      disposed: false,
    }
  })

  return {
    ...actual,
    getDestination: vi.fn(() => ({
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    FFT: MockFFT,
  }
})

describe('SpectrumAnalyser', () => {
  it('renders the canvas and connects FFT', () => {
    render(<SpectrumAnalyser width={500} height={50} />)

    const canvas = screen.getByTestId('spectrum-analyser-canvas')
    expect(canvas).toBeInTheDocument()
    const mockedFFT = vi.mocked(FFT)
    expect(getDestination).toHaveBeenCalledTimes(1)
    expect(mockedFFT).toHaveBeenCalledWith(64)
    expect(mockedFFT).toHaveBeenCalledTimes(1)
  })

  it('should dispose of the FFT on unmount', () => {
    const { unmount } = render(<SpectrumAnalyser width={500} height={50} />)
    unmount()
    const mockedFFT = vi.mocked(FFT)
    expect(mockedFFT.mock.results[0].value.disposed).toBe(true)
  })
})
