//  copied from https://react.dev/learn/managing-state#reacting-to-input-with-state & TSified
// (poss in violaton of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Form from './Form.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Form />
  </StrictMode>
)
