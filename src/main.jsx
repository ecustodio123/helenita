import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ecustodio123/kafka-commerce/styles.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
