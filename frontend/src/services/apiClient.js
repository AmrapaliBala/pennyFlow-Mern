// apiClient.js — configures Axios so your frontend can communicate with your backend.
import axios from 'axios'

const apiClient = axios.create({baseURL: import.meta.env.VITE_API_BASE_URL,})
//axios.create() creates a custom Axios instance with shared configuration.The baseURL is taken from your Vite environment variable.

apiClient.interceptors.request.use((config) => {
  //An interceptor lets you run code before an HTTP request is sent.
  const token = localStorage.getItem('pennyflow_token')

  if (token) {// If a token exists, the code adds it to the request. If no token exists, the request continues without this authorization header.
    config.headers.Authorization = `Bearer ${token}`//The backend can use this header to identify the authenticated user when accessing protected endpoints.
  }

  return config
})

export default apiClient

// For example, your frontend .env file might contain: VITE_API_BASE_URL=http://localhost:5000/api
// Then a request like: apiClient.post('/auth/login', credentials)
// will target: http://localhost:5000/api/auth/login

// Frontend–Backend Authentication Flow (Penny Flow)
// 1. User logs in: LoginPage.jsx collects the email and password and calls loginUser() in authService.js.
// 2. Request to backend: authService.js uses apiClient.js to send a POST request to /auth/login. The Express backend validates the credentials against user data in MongoDB.
// 3. Token is saved: If login succeeds, the backend returns a JWT. authService.js saves it in localStorage using saveToken(), and the frontend redirects the user to /dashboard.
// 4. Interceptor attaches token: When the dashboard requests transactions, the Axios interceptor retrieves the saved token and adds it to the request's Authorization: Bearer <token> header.
// 5. Backend verifies token: Authentication middleware validates the token. If valid, the request proceeds; otherwise, the backend typically returns an HTTP 401 error.
// 6. Database returns data: The controller retrieves the authenticated user's transactions from MongoDB and sends them back to the frontend, which displays them on the dashboard.

// 1. Login request: apiClient.post('/auth/login', credentials) triggers the interceptor. If no token exists in localStorage, the request is sent without an authorization header.
// 2. Login succeeds: The backend returns a token, and saveToken() stores it in localStorage.
// 3. Dashboard request: When the frontend requests transactions, the interceptor runs again, finds the saved token, and attaches it to the Authorization: Bearer <token> header.