import { describe, it, expect } from 'vitest'
import { COLORS } from '@/lib/color'
import { ColorPicker } from './ColorPicker'
import { fireEvent, render } from '@testing-library/react'

describe('ColorPicker', () => {
  it('renders all colors', () => {
    const { getAllByRole } = render(
      <ColorPicker currentColor={COLORS[0]} onSavedColor={vi.fn()} />,
    )

    const buttons = getAllByRole('button')
    expect(buttons).toHaveLength(18)
  })

  it('allows selecting a color', () => {
    const color = COLORS[1]
    const { getByTestId } = render(
      <ColorPicker currentColor={color} onSavedColor={vi.fn()} />,
    )

    const redButton = getByTestId(color.primary)
    fireEvent.click(redButton)

    expect(redButton).toHaveClass('border-gray-100')
  })

  it('calls onSavedColor with the correct RGB value', () => {
    const onSavedColor = vi.fn()
    const { getByTestId } = render(
      <ColorPicker currentColor={COLORS[3]} onSavedColor={onSavedColor} />,
    )

    const selectedColor = COLORS[4]

    fireEvent.click(getByTestId(selectedColor.primary))
    fireEvent.click(getByTestId('save-color-btn'))

    expect(onSavedColor).toHaveBeenCalledWith(COLORS[4])
  })
})
