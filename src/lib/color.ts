export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * Utility function to parse an RGB string into an RGB object.
 */
export function parseRGB(color: string): RGB {
  const match = color.match(/\d+/g)
  if (!match || match.length !== 3) {
    throw new Error(`Invalid RGB format: "${color}"`)
  }
  const [r, g, b] = match.map(Number)
  return { r, g, b }
}
