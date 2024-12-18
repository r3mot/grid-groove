import { fireEvent, render, screen } from '@testing-library/react'
import { Fader } from './Fader'
import { dbToGain, gainToDb } from 'tone'
import { vi } from 'vitest'
const props = Object.freeze({
  minDb: -60,
  maxDb: 0,
  value: 0.5,
  step: 0.01,
})

describe('Fader', () => {
  // https://github.com/radix-ui/primitives/issues/815
  // beforeAll(() => {
  //   window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  //   window.HTMLElement.prototype.setPointerCapture = vi.fn();
  //   window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  // });

  it('renders the Slider with correct props', () => {
    const mockOnChange = vi.fn()
    render(
      <Fader
        minDb={props.minDb}
        maxDb={props.maxDb}
        valueDb={gainToDb(props.value)}
        step={props.step}
        onChange={mockOnChange}
      />,
    )

    const slider = screen.getByRole('slider')

    expect(slider).toBeInTheDocument()

    expect(slider.getAttribute('aria-valuemin')).toBeCloseTo(
      dbToGain(props.minDb),
      6,
    )

    expect(slider.getAttribute('aria-valuemax')).toBeCloseTo(
      dbToGain(props.maxDb),
      6,
    )

    expect(slider.getAttribute('aria-valuenow')).toBeCloseTo(props.value, 6)
  })

  it.skip('calls onChange when the vertical slider is dragged', () => {
    const mockOnChange = vi.fn()
    render(
      <Fader
        minDb={props.minDb}
        maxDb={props.maxDb}
        valueDb={gainToDb(props.value)}
        step={props.step}
        onChange={mockOnChange}
      />,
    )

    const sliderThumb = screen.getByTestId('react-slider-thumb')

    sliderThumb.getBoundingClientRect = vi.fn(() => ({
      x: 0,
      y: 0,
      width: 10,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 10,
      toJSON: () => {},
    }))

    fireEvent.pointerDown(sliderThumb, { clientY: 90 })
    fireEvent.pointerMove(sliderThumb, { clientY: 50 })
    fireEvent.pointerUp(sliderThumb)

    expect(mockOnChange).toHaveBeenCalled()
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Number))

    const updatedValue = sliderThumb.getAttribute('aria-valuenow')
    expect(Number(updatedValue)).toBeLessThan(gainToDb(props.value))
  })
})
