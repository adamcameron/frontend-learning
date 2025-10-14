import { describe, it, expect } from 'vitest'

import process from 'node:process'

function getNodeVersion(): string {
  return process.version
}

describe('tests vitest is operational and test TS code', () => {
  it('should return the current Node.js version', () => {
    const version = getNodeVersion()
    expect(version).toMatch(/^v24\.\d+\.\d+/)
  })
})
