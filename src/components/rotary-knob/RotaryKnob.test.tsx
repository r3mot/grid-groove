import { render, fireEvent, act } from '@testing-library/react'
import { RotaryKnob } from './RotaryKnob'
import { clamp, valueToAngle } from '@/lib/math'

describe('RotaryKnob', () => {
  it('updates rotation on mouse drag', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <RotaryKnob
        minValue={0}
        maxValue={100}
        initialValue={50}
        onValueChange={onValueChange}
      />,
    )

    const knob = getByRole('button')

    fireEvent.mouseDown(knob, { clientY: 200 })
    fireEvent.mouseMove(window, { clientY: 150 })
    fireEvent.mouseUp(window)

    expect(onValueChange).toHaveBeenCalledWith(expect.any(Number))
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('clamps values within range', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <RotaryKnob
        minValue={0}
        maxValue={100}
        initialValue={50}
        onValueChange={onValueChange}
      />,
    )

    const knob = getByRole('button')

    fireEvent.mouseDown(knob, { clientY: 200 })
    fireEvent.mouseMove(window, { clientY: -500 })
    fireEvent.mouseUp(window)

    expect(onValueChange).toHaveBeenLastCalledWith(100)
  })

  it('adds and removes global event listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const onValueChange = vi.fn()
    const { unmount } = render(
      <RotaryKnob
        minValue={0}
        maxValue={100}
        initialValue={50}
        onValueChange={onValueChange}
      />,
    )

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    )
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function),
    )

    unmount() // Simulate component unmount

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function),
    )
  })

  it('calculates correct rotation angle for a given value', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <RotaryKnob
        minValue={0}
        maxValue={100}
        initialValue={50}
        onValueChange={onValueChange}
      />,
    )

    const knob = getByRole('button', { hidden: true })

    act(() => {
      fireEvent.mouseDown(knob, { clientY: 200 })
      fireEvent.mouseMove(window, { clientY: 160 }) // Drag 40px upwards
      fireEvent.mouseUp(window)
    })

    const dy = 200 - 160
    const dv = (dy / 100) * (100 - 0)
    const expectedValue = clamp(50 + dv, 0, 100)
    const expectedRotation = valueToAngle(expectedValue, 0, 100)

    // Extract actual rotation angle from the DOM
    const appliedTransform = knob.style.transform
    const angleMatch = appliedTransform.match(/rotate\(([-\d.]+)deg\)/)
    const actualAngle = angleMatch ? parseFloat(angleMatch[1]) : null

    expect(actualAngle).toBeCloseTo(expectedRotation, 1)
  })
})
