import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './layout/Layout'

function App() {
  return (
    <BrowserRouter>{/* BrowserRouter enables React Router to track the browser's URL and display the appropriate page. */}
      <Layout>{/* Layout is a custom component that wraps all the routes. */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* When a user visits the root URL, /, they are redirected to /login.
          to="/login" specifies the destination.replace replaces the current history entry rather than adding a new one. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

// Without replace:
// 1. User visits /.
// 2. React redirects them to /login.
// 3. When they click the browser's Back button, they may return to /, which redirects them to /login again.
// With replace:
// 1. User visits /.
// 2. React redirects them to /login, replacing / in the browser history.
// 3. When they click Back, they go to the previous page instead of returning to /.