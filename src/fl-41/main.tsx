import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AddProfile from './AddProfile.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AddProfile />
  </StrictMode>
)
