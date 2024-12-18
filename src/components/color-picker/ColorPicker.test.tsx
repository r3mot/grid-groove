import { describe, it, expect } from 'vitest'
import { parseRGB } from '@/lib/color'
import { ColorPicker } from './ColorPicker'
import { fireEvent, render } from '@testing-library/react'
import { toast } from 'sonner'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('parseRGB', () => {
  it('parses valid RGB strings correctly', () => {
    expect(parseRGB('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 })
    expect(parseRGB('rgb(0, 255, 0)')).toEqual({ r: 0, g: 255, b: 0 })
    expect(parseRGB('rgb(0, 0, 255)')).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('throws an error for invalid RGB strings', () => {
    expect(() => parseRGB('invalid')).toThrowError(/Invalid RGB format/)
    expect(() => parseRGB('rgb(255, 0)')).toThrowError(/Invalid RGB format/)
  })
})

describe('ColorPicker', () => {
  it('renders all colors', () => {
    const { getAllByRole } = render(
      <ColorPicker currentColor='rgb(0, 0, 0)' onSavedColor={vi.fn()} />,
    )

    const buttons = getAllByRole('button')
    expect(buttons).toHaveLength(18) // Includes save button
  })

  it('allows selecting a color', () => {
    const { getByLabelText } = render(
      <ColorPicker currentColor='rgb(0, 0, 0)' onSavedColor={vi.fn()} />,
    )

    const redButton = getByLabelText('Select Red')
    fireEvent.click(redButton)

    expect(redButton).toHaveClass('border-gray-100')
  })

  it('calls onSavedColor with the correct RGB value', () => {
    const onSavedColor = vi.fn()
    const { getByLabelText, getByText } = render(
      <ColorPicker currentColor='rgb(0, 0, 0)' onSavedColor={onSavedColor} />,
    )

    fireEvent.click(getByLabelText('Select Red'))
    fireEvent.click(getByText('Save'))

    expect(onSavedColor).toHaveBeenCalledWith({ r: 239, g: 68, b: 68 })
  })

  it('shows a toast error for invalid color values', () => {
    const onSavedColor = vi.fn()

    const { getByText } = render(
      <ColorPicker currentColor='invalid' onSavedColor={onSavedColor} />,
    )

    fireEvent.click(getByText('Save'))

    expect(toast.error).toHaveBeenCalledWith('Invalid color value')
    expect(onSavedColor).not.toHaveBeenCalled()
  })
})
