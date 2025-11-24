import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './profiles/lib/ErrorBoundary.tsx'
import Home from './profiles/home/Home.tsx'
import LoginForm from './profiles/login/LoginForm.tsx'
import Gallery from './profiles/gallery/Gallery.tsx'
import Form from './profiles/add/Form.tsx'
import Nav from './profiles/home/Nav.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profiles/login/" element={<LoginForm />} />
            <Route path="/profiles/gallery/" element={<Gallery />} />
            <Route path="/profiles/add/" element={<Form />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
