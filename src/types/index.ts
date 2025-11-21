export type StepCount = 8 | 16 | 32 | 64
export type Subdivision = '4n' | '8n' | '16n' | '32n'
export type DisplayMode = 'step' | 'velocity'
export type DisplayColor = string

export type Sample = {
  id: string
  name: string
  url: string
  color: DisplayColor
}
