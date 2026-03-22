import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext'

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>,
  )

  window.__KJT_DEBUG__?.markMounted()
} catch (error) {
  window.__KJT_DEBUG__?.show(
    error instanceof Error ? error.stack ?? error.message : String(error)
  )
  throw error
}
