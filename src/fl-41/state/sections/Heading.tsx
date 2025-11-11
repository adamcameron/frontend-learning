// copied from https://react.dev/learn/managing-state#passing-data-deeply-with-context and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useContext } from 'react'
import React from 'react'

import { LevelContext, type supportedLevel } from './LevelContext.tsx'

export default function Heading({ children }: { children: React.ReactNode }) {
  const level = useContext<supportedLevel>(LevelContext)

  if (level === 0) {
    throw Error('Heading must be inside a Section!')
  }

  const Hx = `h${level}` as keyof HTMLElementTagNameMap
  return (
    <Hx>
      {children} (level: {level})
    </Hx>
  )
}
