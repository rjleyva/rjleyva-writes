import { StrictMode } from 'react'
import { HelmetProvider } from '@dr.pogodin/react-helmet'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ApplicationErrorBoundary } from './components/ApplicationErrorBoundary/ApplicationErrorBoundary'
import { ThemeProvider } from './contexts/ThemeProvider'
import routes from './routes/routes'
import './utils/faviconManager'
import './styles/globals.css'

const router = createBrowserRouter(routes, {
  basename: '/'
})

const rootElement = document.getElementById('root')

if (!(rootElement instanceof HTMLElement)) {
  throw new Error('Root element not found. Cannot mount React application.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ApplicationErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </HelmetProvider>
    </ApplicationErrorBoundary>
  </StrictMode>
)
