import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabaseClient } from '@/lib/supabase'
import { type UserResponse } from '@supabase/supabase-js'
import Gallery from '@/profiles/gallery/Gallery.tsx'

describe('Testing Gallery component', () => {
  const waitForOptions = { timeout: 1000 }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the Gallery component with the correct number of profiles', async () => {
    mockGoodClientResponse()

    renderGalleryWithQueryClientProvider()

    await waitFor(() => {
      const profiles: HTMLElement[] = screen.getAllByTestId('profile')
      expect(profiles).toBeDefined()
      if (typeof profiles === 'undefined') {
        return expect.fail('profiles not found in dom')
      }
      expect(profiles.length).toBeGreaterThanOrEqual(3) // default install is 3
    }, waitForOptions)
  })

  it('verifies each profile is an img element', async () => {
    mockGoodClientResponse()

    renderGalleryWithQueryClientProvider()

    await waitFor(() => {
      const profiles: HTMLElement[] = screen.getAllByTestId('profile')
      expect(profiles).toBeDefined()

      if (typeof profiles === 'undefined') {
        return expect.fail('profiles not found in dom')
      }

      expect(
        profiles.length,
        'test aborted: no profiles fetched to check'
      ).toBeGreaterThan(0)

      profiles.forEach((profile) => {
        expect(profile.tagName).toBe('IMG')
      })
    }, waitForOptions)
  })

  it('displays an error message on non-OK response', async () => {
    mockClientResponses(null, StatusCodes.INTERNAL_SERVER_ERROR)

    renderGalleryWithQueryClientProvider()
    await waitFor(() => {
      const galleryError = screen.getByTestId('gallery-error')
      expect(galleryError).toBeDefined()
      expect(galleryError.textContent).toBe('Error: Response status: 500')
    }, waitForOptions)
  })

  it('displays a bad auth message if the user is not authenticated', async () => {
    mockBadAuthResponse()
    renderGalleryWithQueryClientProvider()
    await waitFor(() => {
      const galleryError = screen.getByTestId('gallery-error')
      expect(galleryError).toBeDefined()
      expect(galleryError.textContent).toBe("Ain't logged-in, pal")
    }, waitForOptions)
  })

  function renderGalleryWithQueryClientProvider() {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    render(
      <QueryClientProvider client={queryClient}>
        <Gallery />
      </QueryClientProvider>
    )
  }
})

const goodAuthResponse = {
  data: 'NOT_TESTED',
  error: null,
} as unknown as UserResponse

const badAuthResponse = {
  data: null,
  error: 'NOT_NULL',
} as unknown as UserResponse

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument */
function mockClientResponses(
  data: unknown,
  status: number | null,
  auth = goodAuthResponse
) {
  vi.spyOn(supabaseClient, 'from').mockReturnValue({
    select: vi.fn().mockReturnValue({
      overrideTypes: vi.fn().mockResolvedValue({ data, status }),
    }),
  } as any)

  vi.spyOn(supabaseClient.auth, 'getUser').mockReturnValue(
    Promise.resolve(auth)
  )
}
/* eslint-enable */

function mockGoodClientResponse() {
  mockClientResponses(
    [
      { id: 1, src: '/images/happy.png', alt: 'Happy person' },
      { id: 2, src: '/images/neutral.png', alt: 'Neutral person' },
      { id: 3, src: '/images/sad.png', alt: 'Sad person' },
    ],
    StatusCodes.OK
  )
}

function mockBadAuthResponse() {
  mockClientResponses(null, StatusCodes.OK, badAuthResponse)
}
