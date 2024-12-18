import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner'
import { StoreProvider } from './providers/store/provider.tsx'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <Toaster />
      <App />
    </StoreProvider>
  </StrictMode>,
)
