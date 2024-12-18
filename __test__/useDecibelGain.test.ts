import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useDecibelGain } from '../src/hooks/useDecibelGain'
import { dbToGain } from 'tone'

describe('useDecibelGain Hook', () => {
  it('returns correct minGain and maxGain', () => {
    const { result } = renderHook(() => useDecibelGain(-60, 0, vi.fn()))

    expect(result.current.fader.minGain).toBeCloseTo(dbToGain(-60))
    expect(result.current.fader.maxGain).toBeCloseTo(dbToGain(0))
  })

  it('calls the callback with the correct decibel value when handleValueChange is called', () => {
    const mockCallback = vi.fn()
    const { result } = renderHook(() => useDecibelGain(-60, 0, mockCallback))

    const inputGain = dbToGain(-30)

    act(() => {
      result.current.fader.handleValueChange([inputGain])
    })

    // (converted back to dB)
    expect(mockCallback).toHaveBeenCalledWith(expect.closeTo(-30, 0.01))
  })

  it('ensures db and gain values are consistent after value change', () => {
    const mockCallback = vi.fn()
    const { result } = renderHook(() => useDecibelGain(-60, 0, mockCallback))

    const inputGain = dbToGain(-20)

    act(() => {
      result.current.fader.handleValueChange([inputGain])
    })

    expect(mockCallback).toHaveBeenCalledWith(expect.closeTo(-20, 0.01))

    // Ensure minGain and maxGain are consistent
    expect(result.current.fader.minGain).toBeCloseTo(dbToGain(-60))
    expect(result.current.fader.maxGain).toBeCloseTo(dbToGain(0))
  })
})
