import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./components/Contexts/AuthContext";
import { LoaderProvider } from "./components/Contexts/loaderContext";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </AuthProvider>
  </StrictMode>,
)
