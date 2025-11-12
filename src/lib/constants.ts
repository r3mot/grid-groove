const rgba = (r: number, g: number, b: number, a: number) =>
  `rgba(${r},${g},${b},${a})`

export const DISPLAY_COLORS = [
  { r: 51, g: 255, b: 51 }, // Green
  { r: 102, g: 255, b: 255 }, // Cyan
  { r: 204, g: 153, b: 255 }, // Purple
  { r: 153, g: 204, b: 255 }, // Light Blue
  { r: 255, g: 204, b: 153 }, // Orange
  { r: 255, g: 102, b: 102 }, // Red
  { r: 255, g: 255, b: 102 }, // Yellow
  { r: 255, g: 102, b: 255 }, // Pink
].map(({ r, g, b }) => ({
  primary: rgba(r, g, b, 1.0),
  muted: rgba(r, g, b, 0.5),
  contrast: rgba(r, g, b, 0.2),
}))

export const DECIBEL_RANGE = {
  minDb: -60,
  maxDb: 0,
  defaultDb: -6,
}

export const KEYBOARD_LAYOUT = {
  a: 'C4',
  w: 'C#4',
  s: 'D4',
  e: 'D#4',
  d: 'E4',
  f: 'F4',
  t: 'F#4',
  g: 'G4',
  y: 'G#4',
  h: 'A4',
  u: 'A#4',
  j: 'B4',
  k: 'C5',
  i: 'C#5',
  l: 'D5',
  o: 'D#5',
  ';': 'E5',
}
