import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Gallery from '@/profiles/gallery/Gallery.tsx'

describe('Testing Gallery component', () => {
  const waitForOptions = { timeout: 1000 }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Gallery component with the correct number of profiles', async () => {
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
    renderGalleryWithQueryClientProvider()

    let profiles: HTMLElement[] | undefined

    await waitFor(() => {
      profiles = screen.getAllByTestId('profile')
      expect(profiles).toBeDefined()
    }, waitForOptions)
    if (typeof profiles === 'undefined') {
      return expect.fail('profiles not found in dom')
    }

    profiles.forEach((profile) => {
      expect(profile.tagName).toBe('IMG')
    })
  })

  it('displays an error message on non-200', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => Promise.resolve([]),
    } as Response)

    renderGalleryWithQueryClientProvider()
    await waitFor(() => {
      const galleryError = screen.getByTestId('gallery-error')
      expect(galleryError).toBeDefined()
      expect(galleryError.textContent).toBe('Error: Response status: 500')
    }, waitForOptions)
  })
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
