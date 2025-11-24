import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '@/fl-48/useref/App.tsx'

describe('Tests of useRef', () => {
  it("doesn't cause re-render on change", async () => {
    render(<App />)

    let input!: HTMLInputElement
    let update!: HTMLButtonElement
    let increment!: HTMLButtonElement
    await waitFor(() => {
      input = screen.getByTestId<HTMLInputElement>('input')
      update = screen.getByTestId<HTMLButtonElement>('update')
      increment = screen.getByTestId<HTMLButtonElement>('increment')

      expect(input).toBeDefined()
      expect(update).toBeDefined()
      expect(increment).toBeDefined()
    })

    expect(
      input.value,
      'input has unexpected initial value. Test aborted'
    ).toEqual('0')

    fireEvent.click(increment)
    fireEvent.click(increment)
    fireEvent.click(increment)
    fireEvent.click(increment)
    fireEvent.click(increment)

    await waitFor(() => {
      expect(input.value, "input shouldn't've been updated yet").toEqual('0')
    })

    fireEvent.click(update)
    await waitFor(() => {
      expect(input.value, 'input should have been updated').toEqual('5')
    })
  })
})
