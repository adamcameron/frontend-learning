import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabaseClient } from '@/lib/supabase'
import Form from '@/profiles/add/Form.tsx'

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  return {
    ...(await vi.importActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
  }
})

describe('Tests for add-profile form', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  describe('UI behaviour tests', () => {
    it('has a disabled submit button whilst either text input is empty', () => {
      renderFormWithAllProviders()
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
    it('displays a client error on a client error response', async () => {
      mockClientResponse(null, StatusCodes.BAD_REQUEST)

      fillInAndSubmitForm()

      await waitFor(() => {
        const statusBox = screen.getByTestId('statusBox')

        expect(statusBox.textContent).toBe('Unexpected data validation error')
      })
    })

    it('displays a server error on a server error response', async () => {
      mockClientResponse(null, StatusCodes.INTERNAL_SERVER_ERROR)

      fillInAndSubmitForm()

      await waitFor(() => {
        const statusBox = screen.getByTestId('statusBox')

        expect(statusBox.textContent).toBe('Unexpected server error')
      })
    })

    it('displays an unreachable server error on server unreachable', async () => {
      mockSupabaseClientError()

      fillInAndSubmitForm()

      await waitFor(() => {
        const statusBox = screen.getByTestId('statusBox')

        expect(statusBox.textContent).toBe('Network error when making request')
      })
    })
  })

  describe('OK response tests', () => {
    it('redirects to the gallery on success', async () => {
      mockClientResponse(['NOT_TESTED'], StatusCodes.CREATED)

      fillInAndSubmitForm()

      await waitFor(() => {
        expect(mockedUsedNavigate).toBeCalledWith('/profiles/gallery/')
      })
    })

    it('disables submit whilst processing the submission', async () => {
      mockClientResponse(['NOT_TESTED'], StatusCodes.CREATED, 20)

      renderFormWithAllProviders()
      const inputs: HTMLInputElement[] = screen.getAllByTestId(/^input-.*$/)
      act(() => {
        fireEvent.change(inputs[0], { target: { value: 'valid src' } })
        fireEvent.change(inputs[1], { target: { value: 'valid alt' } })
      })

      await waitFor(() => {
        const submit: HTMLButtonElement = screen.getByTestId('submitButton')
        expect(
          submit.disabled,
          'submit should be enabled immediately before submission'
        ).toBe(false)
      })

      const submit: HTMLButtonElement = screen.getByTestId('submitButton')
      fireEvent.click(submit)
      await waitFor(() => {
        expect(
          submit.disabled,
          'submit should be disabled whilst processing'
        ).toBe(true)
      })
    })
  })

  function renderFormWithAllProviders() {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/profiles/add/']}>
          <Form />
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  function fillInAndSubmitForm() {
    renderFormWithAllProviders()
    const inputs: HTMLInputElement[] = screen.getAllByTestId(/^input-.*$/)

    act(() => {
      fireEvent.change(inputs[0], { target: { value: 'valid src value' } })
      fireEvent.change(inputs[1], { target: { value: 'valid alt value' } })

      const submit: HTMLButtonElement = screen.getByTestId('submitButton')
      fireEvent.click(submit)
    })
  }
})

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument */
function mockClientResponse(data: unknown, status: number | null, delayMs = 0) {
  vi.spyOn(supabaseClient, 'from').mockReturnValue({
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data, status })
          }, delayMs)
        })
      }),
    }),
  } as any)
}

function mockSupabaseClientError() {
  vi.spyOn(supabaseClient, 'from').mockReturnValue({
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockImplementation(() => {
        throw new Error('TEST: Forced exception from Supabase client')
      }),
    }),
  } as any)
}
/* eslint-enable */
