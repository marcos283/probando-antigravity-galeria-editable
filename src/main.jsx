import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import '@fontsource/philosopher/400.css'
import '@fontsource/philosopher/700.css'
import '@fontsource/great-vibes/400.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/700.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
