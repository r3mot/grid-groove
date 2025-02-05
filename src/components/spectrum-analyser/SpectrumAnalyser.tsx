import { useOffscreenCanvas } from '@/hooks/useOffscreenCanvas'
import { clamp } from '@/lib/math'
import { useCallback, useEffect, useRef } from 'react'
import { FFT, getDestination } from 'tone'

function drawRoundedTopRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.moveTo(x, y + height)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height)
  ctx.closePath()
  ctx.fill()
}

interface SpectrumAnalyserProps {
  width?: number
  height?: number
  minDb?: number
  maxDb?: number
}

export function SpectrumAnalyser({
  width = 500,
  height = 50,
  minDb = -100,
  maxDb = 6,
}: SpectrumAnalyserProps) {
  const fftRef = useRef<FFT | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  const { drawToCanvas, getOffscreenCanvas } = useOffscreenCanvas(width, height)

  const initializeFFT = useCallback(() => {
    fftRef.current = new FFT(128)
    getDestination().connect(fftRef.current)
  }, [])

  const drawSpectrum = useCallback(() => {
    if (!fftRef.current) return

    const channelData = fftRef.current.getValue()
    if (!channelData) {
      console.error('FFT data not available')
      return
    }

    drawToCanvas((ctx, canvas) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const channelData = fftRef
        .current!.getValue()
        .slice(0, fftRef.current!.getValue().length / 2)
      const numBars = channelData.length
      const barWidth = canvas.width / numBars
      const spacing = barWidth * 0.1

      channelData.forEach((value, index) => {
        // Clamp the value between min and max db
        // when the input is close to 0 (silence),
        // the dB output will end up with a huge negative number.
        const db = clamp(minDb, typeof value === 'number' ? value : 0, maxDb)
        const normalized = (db - minDb) / (maxDb - minDb)
        const barHeight = normalized * canvas.height

        const x = index * barWidth
        const y = canvas.height - barHeight

        const gradient = ctx.createLinearGradient(x, y, x, canvas.height)
        gradient.addColorStop(0, '#14b8a6')
        gradient.addColorStop(1, '#0ea5e9')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x, y + barHeight)

        drawRoundedTopRect(
          ctx,
          x,
          y,
          Math.max(0, barWidth - spacing),
          barHeight,
          2,
        )
        ctx.fill()
      })
    })
  }, [drawToCanvas, maxDb, minDb])

  const renderCanvas = useCallback(() => {
    const offscreen = getOffscreenCanvas()
    if (!canvasRef.current || !offscreen) return

    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext('2d')

    if (canvasCtx && offscreen) {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
      canvasCtx.drawImage(offscreen as HTMLCanvasElement, 0, 0)
    }
  }, [getOffscreenCanvas])

  const animateSpectrum = useCallback(() => {
    animationRef.current = requestAnimationFrame(animateSpectrum)
    drawSpectrum()
    renderCanvas()
  }, [drawSpectrum, renderCanvas])

  useEffect(() => {
    initializeFFT()
    animateSpectrum()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (fftRef.current) {
        getDestination().disconnect(fftRef.current)
        fftRef.current.dispose()
        fftRef.current = null
      }
    }
  }, [animateSpectrum, initializeFFT])

  return (
    <canvas
      data-testid='spectrum-analyser-canvas'
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: 'block',
        width: '100%',
        background: 'transparent',
      }}
    />
  )
}
