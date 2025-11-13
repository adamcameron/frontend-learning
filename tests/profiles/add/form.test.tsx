import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import Form from '@/profiles/add/Form.tsx'

// needs to be here as the call to vi.mock is hoisted
const mockedUsedNavigate = vi.fn()

describe('Tests for add-profile form', () => {
  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      return {
        ...(await vi.importActual('react-router-dom')),
        useNavigate: () => mockedUsedNavigate,
      }
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('UI behaviour tests', () => {
    it('has a disabled submit button whilst either text input is empty', () => {
      renderWithRouter(Form)
      const inputs: HTMLInputElement[] = screen.getAllByTestId(/^input-.*$/)
      expect(inputs).toHaveLength(2)

      const submit: HTMLButtonElement = screen.getByTestId('submitButton')
      expect(submit.disabled).toBe(true)

      act(() => {
        fireEvent.change(inputs[0], { target: { value: 'any src value' } })
        expect(submit.disabled).toBe(true)

        fireEvent.change(inputs[1], { target: { value: 'any alt value' } })
        expect(submit.disabled).toBe(false)

        fireEvent.change(inputs[1], { target: { value: '' } })
        expect(submit.disabled).toBe(true)
      })
    })
  })

  describe('Bad response behaviour', () => {
    it('displays a client error on a 400 response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: StatusCodes.BAD_REQUEST,
        json: async () => Promise.resolve([]),
      } as Response)

      fillInAndSubmitForm()

      await waitFor(() => {
        const statusBox = screen.getByTestId('statusBox')

        expect(statusBox.textContent).toBe('Unexpected data validation error')
      })
    })

    it('displays a server error on a 500 response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        json: async () => Promise.resolve([]),
      } as Response)

      fillInAndSubmitForm()

      await waitFor(() => {
        const statusBox = screen.getByTestId('statusBox')

        expect(statusBox.textContent).toBe('Unexpected server error')
      })
    })

    it('displays an unreachable server error on server unreachable', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
        return Promise.reject(new Error('MOCKED_FETCH_ERROR'))
      })

      fillInAndSubmitForm()

      await waitFor(() => {
        const statusBox = screen.getByTestId('statusBox')

        expect(statusBox.textContent).toBe('Network error when making request')
      })
    })
  })

  describe('OK response tests', () => {
    it('redirects to the gallery on success', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: StatusCodes.CREATED,
        json: async () => Promise.resolve([]),
      } as Response)

      fillInAndSubmitForm()

      await waitFor(() => {
        expect(mockedUsedNavigate).toBeCalledWith('/profiles/gallery/')
      })
    })

    it('disables submit whilst processing the submission', () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(
        () => new Promise(() => {}) // Never resolves - stays pending forever
      )

      renderWithRouter(Form)
      const inputs: HTMLInputElement[] = screen.getAllByTestId(/^input-.*$/)

      fireEvent.change(inputs[0], { target: { value: 'valid src' } })
      fireEvent.change(inputs[1], { target: { value: 'valid alt' } })

      const submit: HTMLButtonElement = screen.getByTestId('submitButton')
      expect(
        submit.disabled,
        'submit should be enabled immediately before submission'
      ).toBe(false)

      fireEvent.click(submit)

      expect(
        submit.disabled,
        'submit should be disabled whilst processing'
      ).toBe(true)
    })
  })
})

function renderWithRouter(ComponentToRender: React.FC) {
  render(
    <MemoryRouter initialEntries={['/UNTESTED-ROUTE']}>
      <ComponentToRender />
    </MemoryRouter>
  )
}

function fillInAndSubmitForm() {
  renderWithRouter(Form)
  const inputs: HTMLInputElement[] = screen.getAllByTestId(/^input-.*$/)

  act(() => {
    fireEvent.change(inputs[0], { target: { value: 'valid src value' } })
    fireEvent.change(inputs[1], { target: { value: 'valid alt value' } })

    const submit: HTMLButtonElement = screen.getByTestId('submitButton')
    fireEvent.click(submit)
  })
}
