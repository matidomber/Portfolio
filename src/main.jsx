import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import { ModeProvider } from './context/ModeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ModeProvider>
        <App />
      </ModeProvider>
    </LanguageProvider>
  </React.StrictMode>,
)

