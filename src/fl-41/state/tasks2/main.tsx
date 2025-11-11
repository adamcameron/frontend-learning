// copied from https://react.dev/learn/managing-state#scaling-up-with-reducer-and-context and TSified
// (poss in violaton of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
