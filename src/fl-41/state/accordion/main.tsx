import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Form from './Accordion.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Form />
  </StrictMode>
)
