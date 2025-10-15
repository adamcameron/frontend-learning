import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Gallery from '@/fl-38/Gallery'

describe('Testing Gallery component', () => {
  it('renders the Gallery component with the correct number of profiles', () => {
    render(<Gallery />)

    const gallery = screen.getByTestId('gallery')
    const profiles = within(gallery).getAllByTestId('profile')
    expect(profiles).toHaveLength(3)
  })

  it('verifies each profile is an img element', () => {
    render(<Gallery />)

    const gallery = screen.getByTestId('gallery')
    const profiles = within(gallery).getAllByTestId('profile')

    profiles.forEach((profile) => {
      expect(profile.tagName).toBe('IMG')
    })
  })
})
