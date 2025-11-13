import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Gallery from './Gallery.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/pages/profiles/gallery/" element={<Gallery />} />
      </Routes>
    </Router>
  </StrictMode>
)
