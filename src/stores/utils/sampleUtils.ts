import { COLORS } from '@/lib/color'
import { Sample } from '@/types'

// Get path and name of samples
export function getPathAndName(
  samples: string[],
): { path: string; name: string }[] {
  return samples.map(filePath => {
    const parts = filePath.split('/')
    const fileName = parts[parts.length - 1]
    const name = fileName.replace('.wav', '')
    return { path: filePath, name }
  })
}

// Create sample objects
export function createSamples(
  samples: { path: string; name: string }[],
): Sample[] {
  return samples.map((sample, i) => ({
    id: sample.name.toString(),
    name: sample.name,
    url: sample.path,
    color: COLORS[i],
  }))
}
