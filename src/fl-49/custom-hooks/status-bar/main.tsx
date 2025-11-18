import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import StatusBar from './StatusBar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatusBar />
  </StrictMode>
)
