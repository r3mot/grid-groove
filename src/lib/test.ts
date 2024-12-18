export const createStepsArray = (
  rows: number,
  columns: number,
  activeIndices: Record<number, number[]>,
): boolean[][] => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from(
      { length: columns },
      (_, col) => activeIndices[row]?.includes(col) ?? false,
    ),
  )
}

export const createUniformArray = (
  rows: number,
  columns: number,
  value: number,
): number[][] => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => value),
  )
}
