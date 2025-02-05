const generateDisplayColors = (rgb: string) => ({
  primary: `rgba(${rgb}, 1.0)`,
  muted: `rgba(${rgb}, 0.5)`,
  contrast: `rgba(${rgb}, 0.2)`,
})

const RGB_VALUES = [
  '239,68,68', // Red
  '249,115,22', // Orange
  '245,158,11', // Amber
  '234,179,8', // Yellow
  '132,204,22', // Lime
  '34,197,94', // Green
  '16,185,129', // Emerald
  '20,184,166', // Teal
  '6,182,212', // Cyan
  '14,165,233', // Sky
  '59,130,246', // Blue
  '99,102,241', // Indigo
  '139,92,246', // Violet
  '168,85,247', // Purple
  '217,70,239', // Fuchsia
  '236,72,153', // Pink
  '244,63,94', // Rose
]

export const COLORS = RGB_VALUES.map(rgb => generateDisplayColors(rgb))
