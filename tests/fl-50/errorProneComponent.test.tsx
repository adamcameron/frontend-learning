import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ErrorProneComponent from '@/fl-50/ErrorProneComponent.tsx'
import ErrorBoundary from '@/fl-50/ErrorBoundary.tsx'

describe("Tests of ErrorProneComponent's ErrorBoundary", () => {
  beforeEach(mockOutComponentLogging)

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders the button when it's safe", async () => {
    let button = await renderAndAwaitButton()

    expect(
      button.textContent,
      'button has unexpected initial value. Test aborted'
    ).toEqual('Break things')
  })

  it("renders the error message when it's not safe", async () => {
    let button = await renderAndAwaitButton()

    fireEvent.click(button)

    await waitFor(() => {
      expect(() => {
        screen.getByTestId<HTMLButtonElement>('button')
      }).toThrowError(/Unable to find an element/)
      const h1 = screen.getByTestId<HTMLHeadingElement>('h1')
      expect(h1).toBeDefined()
      expect(h1.textContent).toEqual('Sorry: there was an error: Error: Oopsy')
    })
  })

  async function renderAndAwaitButton(): Promise<HTMLButtonElement> {
    let button!: HTMLButtonElement
    render(
      <ErrorBoundary>
        <ErrorProneComponent />
      </ErrorBoundary>
    )
    await waitFor(() => {
      button = screen.getByTestId<HTMLButtonElement>('button')
      expect(button).toBeDefined()
    })

    return button
  }

  function mockOutComponentLogging() {
    vi.spyOn(console, 'dir').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  }
})
