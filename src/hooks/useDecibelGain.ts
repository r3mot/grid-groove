import { dbToGain, gainToDb } from 'tone'

export function useDecibelGain(
  minDb: number,
  maxDb: number,
  callback: (value: number) => void,
) {
  const minGain = dbToGain(minDb)
  const maxGain = dbToGain(maxDb)

  function handleValueChange(value: number[]) {
    callback(gainToDb(value[0]))
  }

  return {
    fader: {
      minGain,
      maxGain,
      handleValueChange,
    },
  }
}
