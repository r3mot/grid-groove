export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function valueToAngle(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 320 - 160
}
