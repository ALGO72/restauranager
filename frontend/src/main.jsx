import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 2000,
    }
  }
})

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

async function wakeUpBackend() {
  const loader = document.getElementById('loader')
  const root = document.getElementById('root')

  if (loader) loader.style.display = 'flex'
  if (root) root.style.display = 'none'

  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    try {
      const res = await fetch(`${BACKEND_URL}/`, { signal: AbortSignal.timeout(8000) })
      if (res.ok) break
    } catch {
      attempts++
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  if (loader) loader.style.display = 'none'
  if (root) root.style.display = 'block'
}

wakeUpBackend().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  )
})