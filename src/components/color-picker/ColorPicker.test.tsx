import { describe, it, expect, vi } from 'vitest'
import { COLORS } from '@/lib/color'
import { ColorPicker } from './ColorPicker'
import { fireEvent, render } from '@testing-library/react'

describe('ColorPicker', () => {
  const defaultColor = COLORS[0]

  it('renders all colors', () => {
    const { getAllByTestId } = render(
      <ColorPicker currentColor={defaultColor} onSavedColor={vi.fn()} />,
    )

    const btns = getAllByTestId(/rgba/)
    expect(btns.length).toBe(COLORS.length)
  })

  it('selects a color when clicked', () => {
    const target = COLORS[2]

    const { getByTestId } = render(
      <ColorPicker currentColor={defaultColor} onSavedColor={vi.fn()} />,
    )

    const btn = getByTestId(target.primary)
    fireEvent.click(btn)

    expect(btn.querySelector('svg')).toBeInTheDocument()
  })

  it('calls onSavedColor with selected color when Save is clicked', () => {
    const onSavedColor = vi.fn()
    const selected = COLORS[4]

    const { getByTestId } = render(
      <ColorPicker currentColor={defaultColor} onSavedColor={onSavedColor} />,
    )

    fireEvent.click(getByTestId(selected.primary))
    fireEvent.click(getByTestId('save-color-btn'))

    expect(onSavedColor).toHaveBeenCalledTimes(1)
    expect(onSavedColor).toHaveBeenCalledWith(selected)
  })
})
