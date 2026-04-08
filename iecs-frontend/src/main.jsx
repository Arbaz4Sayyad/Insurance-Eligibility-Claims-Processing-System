import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import AxiosInterceptor from './api/AxiosInterceptor'
import { ApplicationProvider } from './context/ApplicationContext'
import { StaffProvider } from './context/StaffContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <ThemeProvider>
          <AuthProvider>
            <StaffProvider>
              <ApplicationProvider>
                <AxiosInterceptor>
                  <App />
                </AxiosInterceptor>
              </ApplicationProvider>
            </StaffProvider>
          </AuthProvider>
        </ThemeProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>,
)
