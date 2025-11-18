import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SaveButton from './SaveButton.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SaveButton />
  </StrictMode>
)
