import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#00E5FF', 
          colorBackground: '#1A232E', 
          colorText: '#FFFFFF',
          colorTextSecondary: '#A0AEC0',
          colorInputBackground: '#2D3748',
          colorInputText: '#FFFFFF',
        },
        elements: {
          headerTitle: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#00E5FF',
          },
          card: {
            border: '1px solid #2D3748',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          socialButtonsBlockButton: {
            backgroundColor: 'transparent',
            border: '1px solid #2D3748',
            '&:hover': {
              backgroundColor: '#2D3748',
            }
          }
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)