import { useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

function Layout({ children }) {
  const { pathname } = useLocation()
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password'

  if (isAuthPage) {
    return children
  }
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout