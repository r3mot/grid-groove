import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface MixerState {
  soloIds: Set<string>
  toggleSolo: (id: string) => void
}

export const useMixerStore = create<MixerState>()(
  devtools(set => ({
    soloIds: new Set<string>(),

    toggleSolo: id =>
      set(state => {
        const soloIds = new Set(state.soloIds)
        if (soloIds.has(id)) {
          soloIds.delete(id)
        } else {
          soloIds.add(id)
        }
        return { soloIds }
      }),
  })),
)
