// copied from https://react.dev/learn/managing-state#passing-data-deeply-with-context and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { createContext } from 'react'

export type supportedLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const LevelContext = createContext<supportedLevel>(0)
