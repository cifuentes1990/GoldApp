import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#F5F5F5',
            border: '1px solid rgba(245,176,66,0.3)',
            borderRadius: '8px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#F5B042', secondary: '#0A0A0A' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#0A0A0A' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
