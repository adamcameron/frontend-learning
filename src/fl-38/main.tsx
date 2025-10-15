import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '/public/css/gallery.css'
import Gallery from './Gallery.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>
)
