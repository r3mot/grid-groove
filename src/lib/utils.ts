import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const adjustArraySize = <T>(
  array: T[],
  newSize: number,
  fillValue: T,
): T[] => {
  if (array.length < newSize) {
    return [...array, ...Array(newSize - array.length).fill(fillValue)]
  }
  return array.slice(0, newSize)
}

export function groupByColumn(column: number) {
  return column % 8 < 4 ? 'even' : 'odd'
}
