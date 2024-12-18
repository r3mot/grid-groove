import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, beforeEach, expect } from 'vitest'
import { TrackColorPicker } from './TrackColorPicker'
import { RGB } from '@/lib/color'

// Mock useSampleStore
vi.mock('@/providers/store/sampleStore', () => ({
  useSampleStore: vi.fn(),
}))

describe('TrackColorPicker', () => {
  const mockUpdateSample = vi.fn()
  const trackId = 'clhat'
  const currentColor = 'rgb(255, 0, 0)'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the popover trigger with the correct background color', () => {
    render(<TrackColorPicker trackId={trackId} currentColor={currentColor} />)
    const trigger = screen.getByRole('button', { name: /change color/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveStyle(`background-color: ${currentColor}`)
  })

  it('opens the popover when the trigger is clicked', async () => {
    render(<TrackColorPicker trackId={trackId} currentColor={currentColor} />)
    const trigger = screen.getByRole('button', { name: /change color/i })

    // Verify popover is initially closed
    expect(screen.queryByText(/save/i)).not.toBeInTheDocument()

    // Click the trigger
    fireEvent.click(trigger)

    // Verify popover opens
    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeInTheDocument()
    })
  })

  it.skip('calls updateSample with the correct data and closes the popover when a color is selected', async () => {
    render(<TrackColorPicker trackId={trackId} currentColor={currentColor} />)
    const trigger = screen.getByRole('button', { name: /change color/i })

    // Mock a selected color
    const selectedColor: RGB = { r: 0, g: 255, b: 0 }

    // Open the popover
    fireEvent.click(trigger)
    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeInTheDocument()
    })

    // Mock the ColorPicker's onSavedColor event
    const colorPicker = screen.getByText(/save/i)
    fireEvent.change(colorPicker, { target: { value: selectedColor } })

    // Trigger handleChange
    fireEvent.submit(colorPicker)

    // Wait for async updates
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
