import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <App />
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
