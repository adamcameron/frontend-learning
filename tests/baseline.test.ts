import { describe, it, expect } from 'vitest'

import process from 'node:process'

function getNodeVersion(): string {
  return process.version
}

describe('System-level tests', () => {
  describe('vitest tests', () => {
    it('should return the current Node.js version', () => {
      const version = getNodeVersion()
      expect(version).toMatch(/^v24\.\d+\.\d+/)
    })
  })
  describe('env tests', () => {
    it.each(['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'])(
      'has required env vars: [%s]',
      (envVarName: string) => {
        expect(process.env[envVarName]).toBeDefined()
        expect(process.env[envVarName]?.length).toBeGreaterThan(0)
      }
    )
  })
})
