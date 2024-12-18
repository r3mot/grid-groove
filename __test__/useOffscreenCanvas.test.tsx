import { renderHook, act } from '@testing-library/react'
import { useOffscreenCanvas } from '../src/hooks/useOffscreenCanvas'

describe('useOffscreenCanvas', () => {
  it('executes a drawing operation on the canvas', () => {
    const { result } = renderHook(() => useOffscreenCanvas(200, 100))
    const drawingCallback = vi.fn()

    act(() => {
      result.current.drawToCanvas(drawingCallback)
    })

    expect(drawingCallback).toHaveBeenCalledTimes(1)

    const [ctx, canvas] = drawingCallback.mock.calls[0]
    expect(ctx).toBeInstanceOf(CanvasRenderingContext2D)
    expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    expect(canvas.width).toBe(200)
    expect(canvas.height).toBe(100)
  })
})
