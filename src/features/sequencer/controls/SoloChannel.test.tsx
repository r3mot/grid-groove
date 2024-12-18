import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { useSequenceStore } from '@/providers/store/sequenceStore'
import { SoloChannel } from './SoloChannel'

describe('SoloChannel Component with Zustand Store', () => {
  it('toggles solo state for the specified channel ID', async () => {
    const user = userEvent.setup()

    useSequenceStore.setState({
      soloChannelIds: new Set(['channel-2']),
      toggleSoloChannel: (id: string) =>
        useSequenceStore.setState(state => {
          const updatedSoloIds = new Set(state.soloChannelIds)
          if (updatedSoloIds.has(id)) {
            updatedSoloIds.delete(id)
          } else {
            updatedSoloIds.add(id)
          }
          return { soloChannelIds: updatedSoloIds }
        }),
    })

    render(<SoloChannel id='channel-1' />)

    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('data-state', 'off')

    await user.click(button)
    let { soloChannelIds } = useSequenceStore.getState()
    expect(soloChannelIds.has('channel-1')).toBe(true)
    expect(button).toHaveAttribute('data-state', 'on')

    await user.click(button)
    soloChannelIds = useSequenceStore.getState().soloChannelIds
    expect(soloChannelIds.has('channel-1')).toBe(false)
    expect(button).toHaveAttribute('data-state', 'off')
  })

  it('maintains solo state for other channels when toggling', async () => {
    const user = userEvent.setup()

    useSequenceStore.setState({
      soloChannelIds: new Set(['channel-1', 'channel-2']),
      toggleSoloChannel: (id: string) =>
        useSequenceStore.setState(state => {
          const updatedSoloIds = new Set(state.soloChannelIds)
          if (updatedSoloIds.has(id)) {
            updatedSoloIds.delete(id)
          } else {
            updatedSoloIds.add(id)
          }
          return { soloChannelIds: updatedSoloIds }
        }),
    })

    render(
      <>
        <SoloChannel id='channel-1' />
        <SoloChannel id='channel-2' />
      </>,
    )

    const buttons = screen.getAllByRole('button')

    // Verify initial states
    expect(buttons[0]).toHaveAttribute('data-state', 'on') // channel-1
    expect(buttons[1]).toHaveAttribute('data-state', 'on') // channel-2

    // toggle solo OFF for channel-1
    await user.click(buttons[0])

    const { soloChannelIds } = useSequenceStore.getState()
    expect(soloChannelIds.has('channel-1')).toBe(false) // channel-1 toggled off
    expect(soloChannelIds.has('channel-2')).toBe(true) // channel-2 remains soloed

    expect(buttons[0]).toHaveAttribute('data-state', 'off')
    expect(buttons[1]).toHaveAttribute('data-state', 'on')
  })
})
