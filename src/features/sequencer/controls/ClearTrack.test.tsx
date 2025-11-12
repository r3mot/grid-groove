import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { useSequenceStore } from '@/stores/sequenceStore'
import { ClearTrack } from './ClearTrack'
import { createStepsArray, createUniformArray } from '@/lib/test'

describe('ClearTrack Component with Zustand Store', () => {
  it('clears only the specified row in steps and velocities', async () => {
    const rows = 3
    const columns = 8

    const initialSteps = createStepsArray(rows, columns, {
      0: [0, 1], // Active steps in row 0
      1: [1, 2], // Active steps in row 1
      2: [0], // Active steps in row 2
    })

    const initialVelocities = createUniformArray(rows, columns, 1)

    useSequenceStore.setState({
      steps: initialSteps,
      velocities: initialVelocities,
      stepCount: columns,
    })

    render(<ClearTrack row={1} />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    const { steps, velocities } = useSequenceStore.getState()

    expect(steps[1]).toEqual(Array(columns).fill(false))
    expect(velocities[1]).toEqual(Array(columns).fill(1))

    expect(steps[0]).toEqual(initialSteps[0])
    expect(steps[2]).toEqual(initialSteps[2])
    expect(velocities[0]).toEqual(initialVelocities[0])
    expect(velocities[2]).toEqual(initialVelocities[2])
    expect(steps[1]).not.toEqual(initialSteps[1])
  })
})
