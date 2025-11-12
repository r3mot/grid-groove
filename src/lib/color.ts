import { DisplayColor } from '@/types'
import colormap from 'colormap'

export const COLORS = colormap({
  colormap: 'hsv',
  nshades: 24,
  format: 'rgba',
}).map(rgba => {
  const [r, g, b] = rgba
  return {
    primary: `rgba(${r},${g},${b},1)`,
    muted: `rgba(${r},${g},${b},0.5)`,
  }
})

export function radialGradient(color: DisplayColor) {
  return `radial-gradient(circle, ${color.primary} 0%, ${color.muted} 100%)`
}
