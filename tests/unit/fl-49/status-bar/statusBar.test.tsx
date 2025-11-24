import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatusBar from '@/fl-49/custom-hooks/status-bar/StatusBar.tsx'

describe('Tests of custom hooks', () => {
  it('changes status when the network is (dis|en)abled', async () => {
    render(<StatusBar />)

    let statusBar: HTMLHeadingElement
    await waitFor(() => {
      statusBar = screen.getByTestId<HTMLHeadingElement>('status-bar')
      expect(
        statusBar.textContent,
        'unexpected initial status, test aborted'
      ).toBe('✅ Online')
    })

    act(() => {
      window.dispatchEvent(new window.Event('offline'))
    })
    await waitFor(() => {
      expect(statusBar.textContent).toBe('❌ Disconnected')
    })
  })
})
