import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabaseClient } from '@/lib/supabase'
import { loginCredentials } from '@/lib/testCredentials'
import Gallery from '@/profiles/gallery/Gallery.tsx'

describe('Testing Gallery component with live data', () => {
  const waitForOptions = { timeout: 1000 }

  it("displays a no-auth error message if there's no authenticated user", async () => {
    renderGalleryWithQueryClientProvider()
    await waitFor(() => {
      const galleryError = screen.getByTestId('gallery-error')
      expect(galleryError).toBeDefined()
      expect(galleryError.textContent).toBe("Ain't logged-in, pal")
    }, waitForOptions)
  })

  it("displays the gallery if there's an authenticated user", async () => {
    void (await supabaseClient.auth.signInWithPassword(loginCredentials))
    renderGalleryWithQueryClientProvider()

    await waitFor(() => {
      const profiles: HTMLElement[] | undefined =
        screen.getAllByTestId('profile')
      expect(profiles).toBeDefined()

      if (typeof profiles === 'undefined') {
        return expect.fail('profiles not found in dom')
      }
      expect(profiles.length).toBeGreaterThanOrEqual(3) // default install is 3
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
