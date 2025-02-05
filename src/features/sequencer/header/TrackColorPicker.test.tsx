import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, beforeEach, expect } from 'vitest'
import { TrackColorPicker } from './TrackColorPicker'
import { COLORS } from '@/lib/color'

vi.mock('@/providers/store/sampleStore', () => ({
  useSampleStore: vi.fn(() => ({
    updateSamplerColor: vi.fn(),
  })),
}))

describe('TrackColorPicker', () => {
  const mockUpdateSample = vi.fn()
  const trackId = 'clhat'
  const currentColor = COLORS[0]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the popover trigger with the correct background color', () => {
    render(<TrackColorPicker trackId={trackId} currentColor={currentColor} />)
    const trigger = screen.getByRole('button', { name: /change color/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveStyle(`background-color: ${currentColor.primary}`)
  })

  it('opens the popover when the trigger is clicked', async () => {
    render(<TrackColorPicker trackId={trackId} currentColor={currentColor} />)
    const trigger = screen.getByRole('button', { name: /change color/i })

    expect(screen.queryByText(/save/i)).not.toBeInTheDocument()
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeInTheDocument()
    })
  })

  it.skip('calls updateSample with the correct data and closes the popover when a color is selected', async () => {
    render(<TrackColorPicker trackId={trackId} currentColor={currentColor} />)
    const trigger = screen.getByRole('button', { name: /change color/i })

    fireEvent.click(trigger)
    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeInTheDocument()
    })

    const newColor = COLORS[2]
    const colorPicker = screen.getByText(/save/i)
    fireEvent.change(colorPicker, { target: { value: newColor } })

    fireEvent.submit(colorPicker)

    await waitFor(() => {
      expect(mockUpdateSample).toHaveBeenCalledWith({
        id: trackId,
        color: {
          primary: 'rgb(0, 255, 0)',
          muted: 'rgba(0, 255, 0, 0.5)',
        },
      })

      // Verify the popover closes
      expect(screen.queryByText(/save/i)).not.toBeInTheDocument()
    })
  })
})
