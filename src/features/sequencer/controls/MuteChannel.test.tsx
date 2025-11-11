import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MuteChannel } from './MuteChannel'
import { Channel } from 'tone'

// Mock Tone.js
vi.mock('tone', async () => {
  const actual = await vi.importActual<typeof import('tone')>('tone')

  class MockChannel {
    mute = false
    volume = { value: 0 }
  }

  return {
    ...actual,
    Channel: MockChannel,
  }
})

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

    expect(button).toHaveAttribute('data-state', 'off')
    expect(mockChannel.mute).toBe(false)

    fireEvent.click(button)
    expect(mockChannel.mute).toBe(true)
    expect(button).toHaveAttribute('data-state', 'on')

    fireEvent.click(button)
    expect(mockChannel.mute).toBe(false)
    expect(button).toHaveAttribute('data-state', 'off')
  })

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

    expect(vi.getTimerCount()).toBe(0)
    vi.useRealTimers()
  })
})
