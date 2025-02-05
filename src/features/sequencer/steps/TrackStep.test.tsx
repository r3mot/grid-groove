import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TrackStep } from './TrackStep'
import { COLORS } from '@/lib/color'

describe('TrackStep Component', () => {
  const mockOnStepChange = vi.fn()

  const defaultProps = {
    row: 0,
    column: 1,
    displayColor: COLORS[0],
    isActive: false,
    onStepChange: mockOnStepChange,
  }

  it('renders correctly with initial state', () => {
    render(<TrackStep {...defaultProps} />)

    const checkbox = screen.getByRole('checkbox')
    const listItem = screen.getByRole('listitem')

    expect(checkbox).not.toBeChecked()
    expect(listItem).toHaveStyle('background:')
  })

  it('applies active styles when isActive is true', () => {
    render(<TrackStep {...defaultProps} isActive={true} />)

    const listItem = screen.getByRole('listitem')

    expect(listItem).toHaveStyle(
      'background: radial-gradient(circle, #ff0000 0%, #cccccc 100%)',
    )
  })

  it('calls onStepChange with correct arguments when checkbox is clicked', () => {
    render(<TrackStep {...defaultProps} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(mockOnStepChange).toHaveBeenCalledWith(1, 0, true)
  })

  it('calls onStepChange with correct arguments when Enter key is pressed', () => {
    render(<TrackStep {...defaultProps} />)

    const listItem = screen.getByRole('listitem')
    fireEvent.keyDown(listItem, { key: 'Enter' })

    expect(mockOnStepChange).toHaveBeenCalledWith(1, 0, true)
  })

  it('calls onStepChange with correct arguments when Space key is pressed', () => {
    render(<TrackStep {...defaultProps} />)

    const listItem = screen.getByRole('listitem')

    fireEvent.keyDown(listItem, { key: ' ' })

    expect(mockOnStepChange).toHaveBeenCalledWith(1, 0, true)
  })
})
