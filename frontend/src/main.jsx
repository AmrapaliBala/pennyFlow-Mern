import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'//Provides Google authentication functionality to React components.
import './index.css'
import App from './App.jsx'//Imports the main App component, which contains your application's UI.

{/* <App /> is a React component.const app stores the React element created from that component.
You can reuse app wherever you need to render the main application. */}
const app = <App />
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {googleClientId ? (// Your code checks whether googleClientId exists.
    // The GoogleOAuthProvider wraps your application and makes Google OAuth functionality available to the relevant child components.
      <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
    ) : (
      app
    )}
  </StrictMode>,
)
