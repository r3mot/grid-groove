import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MuteChannel } from './MuteChannel'
import { Channel } from 'tone'

// Mock Tone.js
vi.mock('tone', async () => {
  const actual = await vi.importActual<typeof import('tone')>('tone')

  return {
    ...actual,
    Channel: vi.fn().mockImplementation(() => ({
      mute: false,
      volume: { value: 0 },
    })),
  }
})

// Mock Icons
vi.mock('@/components/icons/Speaker', () => ({
  SpeakerIcon: () => <span data-testid='speaker-icon'>SpeakerOn</span>,
}))

vi.mock('@/components/icons/SpeakerOff', () => ({
  SpeakerOffIcon: () => (
    <span data-testid='speaker-muted-icon'>SpeakerOff</span>
  ),
}))

describe('MuteChannel Component', () => {
  let mockChannel: Channel

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a fresh mock Channel for each test
    mockChannel = new Channel()
  })

  it('renders with initial unmuted state', () => {
    render(<MuteChannel channel={mockChannel} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-state', 'off')
    expect(screen.getByTestId('speaker-icon')).toBeInTheDocument()
  })

  it('renders with initial muted state when channel.mute is true', () => {
    mockChannel.mute = true

    render(<MuteChannel channel={mockChannel} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-state', 'on')
    expect(screen.getByTestId('speaker-muted-icon')).toBeInTheDocument()
  })

  it('toggles mute state when button is clicked', () => {
    render(<MuteChannel channel={mockChannel} />)

    const button = screen.getByRole('button')

    // Initial state: unmuted
    expect(button).toHaveAttribute('data-state', 'off')
    expect(mockChannel.mute).toBe(false)

    // Click to mute
    fireEvent.click(button)
    expect(mockChannel.mute).toBe(true)
    expect(button).toHaveAttribute('data-state', 'on')

    // Click to unmute
    fireEvent.click(button)
    expect(mockChannel.mute).toBe(false)
    expect(button).toHaveAttribute('data-state', 'off')
  })

  // TODO: Implement this test
  it('syncs muted state with volume.value as -Infinity', () => {
    mockChannel.volume.value = -Infinity

    render(<MuteChannel channel={mockChannel} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-state', 'on')
    expect(screen.getByTestId('speaker-muted-icon')).toBeInTheDocument()
  })

  it('cleans up the interval on unmount', () => {
    vi.useFakeTimers()

    const { unmount } = render(<MuteChannel channel={mockChannel} />)
    unmount()

    // Ensure there are no pending timers
    expect(vi.getTimerCount()).toBe(0)
    vi.useRealTimers()
  })
})
