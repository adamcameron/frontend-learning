// copied from https://react.dev/learn/managing-state#passing-data-deeply-with-context and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useContext } from 'react'
import React from 'react'
import { LevelContext, type supportedLevel } from './LevelContext.tsx'

export default function Section({ children }: { children: React.ReactNode }) {
  const level = useContext(LevelContext)
  const nextLevel: supportedLevel = (level + 1) as supportedLevel
  return (
    <section className="section">
      <LevelContext value={nextLevel}>{children}</LevelContext>
    </section>
  )
}
