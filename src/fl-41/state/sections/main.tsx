// copied from https://react.dev/learn/managing-state#passing-data-deeply-with-context and TSified
// (poss in violaton of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
