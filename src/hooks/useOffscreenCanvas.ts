import { useRef, useCallback } from 'react'

type CanvasDrawingCallback = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
) => void
/**
 * Creates an offscreen canvas and manages its context.
 * @param width - The width of the offscreen canvas.
 * @param height - The height of the offscreen canvas.
 */
export function useOffscreenCanvas(width: number, height: number) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvasRef.current = canvas
    }

    return canvasRef.current
  }, [width, height])

  const getCanvasContext = useCallback(() => {
    const canvas = initializeCanvas()
    return canvas.getContext('2d')
  }, [initializeCanvas])

  const drawToCanvas = useCallback(
    (drawingCallback: CanvasDrawingCallback) => {
      const ctx = getCanvasContext()
      const canvas = canvasRef.current

      if (ctx && canvas) {
        drawingCallback(ctx, canvas)
      } else {
        console.error('Offscreen canvas context is not available.')
      }
    },
    [getCanvasContext],
  )

  const getOffscreenCanvas = useCallback(() => {
    return canvasRef.current || initializeCanvas()
  }, [initializeCanvas])

  return { drawToCanvas, getOffscreenCanvas }
}
