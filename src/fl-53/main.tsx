import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ImageManager from './ImageManager.tsx'
import ErrorBoundary from '../lib/ErrorBoundary.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ImageManager />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
