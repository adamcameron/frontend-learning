import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Gallery from '@/profiles/gallery/Gallery.tsx'

describe('Testing Gallery component', () => {
  afterEach(() => {
    vi.clearAllMocks() // Reset all mocked calls between tests
  })

  it('renders the Gallery component with the correct number of profiles', async () => {
    render(<Gallery />)

    let profiles: HTMLElement[] | undefined

    await waitFor(() => {
      profiles = screen.getAllByTestId('profile')
      expect(profiles).toBeDefined()
    })

    if (typeof profiles === 'undefined') {
      return expect.fail('profiles not found in dom')
    }
    expect(profiles.length).toBeGreaterThanOrEqual(3) // default install is 3
  })

  it('verifies each profile is an img element', async () => {
    render(<Gallery />)

    let profiles: HTMLElement[] | undefined

    await waitFor(() => {
      profiles = screen.getAllByTestId('profile')
      expect(profiles).toBeDefined()
    })
    if (typeof profiles === 'undefined') {
      return expect.fail('profiles not found in dom')
    }

    profiles.forEach((profile) => {
      expect(profile.tagName).toBe('IMG')
    })
  })

  it('logs to console if the response is non-200', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => Promise.resolve([]),
    } as Response)

    const consoleSpy = vi.spyOn(console, 'error')
    consoleSpy.mockImplementation(() => {})

    render(<Gallery />)
    await waitFor(() => {
      expect(screen.getAllByTestId('gallery')).toBeDefined()
    })

    expect(consoleSpy).toHaveBeenCalledWith(new Error('Response status: 500'))
  })
})
