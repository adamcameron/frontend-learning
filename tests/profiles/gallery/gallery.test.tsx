import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Gallery from '@/profiles/gallery/Gallery.tsx'
import { supabaseClient } from '@/profiles/lib/supabase.ts'

describe('Testing Gallery component', () => {
  const waitForOptions = { timeout: 1000 }
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    queryClient.clear()
  })

  it('renders the Gallery component with the correct number of profiles', async () => {
    mockGoodClientResponse()

    renderGalleryWithQueryClientProvider()

    let profiles: HTMLElement[] | undefined

    await waitFor(() => {
      profiles = screen.getAllByTestId('profile')
      expect(profiles).toBeDefined()
    }, waitForOptions)

    if (typeof profiles === 'undefined') {
      return expect.fail('profiles not found in dom')
    }
    expect(profiles.length).toBeGreaterThanOrEqual(3) // default install is 3
  })

  it('verifies each profile is an img element', async () => {
    mockGoodClientResponse()

    renderGalleryWithQueryClientProvider()

    let profiles: HTMLElement[] | undefined

    await waitFor(() => {
      profiles = screen.getAllByTestId('profile')
      expect(profiles).toBeDefined()
    }, waitForOptions)
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
  })

  it('displays an error message on non-OK response', async () => {
    mockClientResponse(null, StatusCodes.INTERNAL_SERVER_ERROR)

    renderGalleryWithQueryClientProvider()
    await waitFor(() => {
      const galleryError = screen.getByTestId('gallery-error')
      expect(galleryError).toBeDefined()
      expect(galleryError.textContent).toBe('Error: Response status: 500')
    }, waitForOptions)
  })

  function renderGalleryWithQueryClientProvider() {
    render(
      <QueryClientProvider client={queryClient}>
        <Gallery />
      </QueryClientProvider>
    )
  }
})

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument */
function mockClientResponse(data: unknown, status: number | null) {
  vi.spyOn(supabaseClient, 'from').mockReturnValue({
    select: vi.fn().mockReturnValue({
      overrideTypes: vi.fn().mockResolvedValue({ data, status }),
    }),
  } as any)
}
/* eslint-enable */

function mockGoodClientResponse() {
  mockClientResponse(
    [
      { id: 1, src: '/images/happy.png', alt: 'Happy person' },
      { id: 2, src: '/images/neutral.png', alt: 'Neutral person' },
      { id: 3, src: '/images/sad.png', alt: 'Sad person' },
    ],
    StatusCodes.OK
  )
}
