import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './style.css'
import { GastosProvider } from './context/GastosContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GastosProvider>
        <App />
      </GastosProvider>
    </BrowserRouter>
  </React.StrictMode>
)
