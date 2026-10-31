import { CircleDollarSign, LayoutDashboard, LogOut } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { getAuthToken, logoutUser } from '../services/authService'
// Link navigates to another route without reloading the whole page.
// NavLink does the same but also tells you whether its route is currently active. This is useful for highlighting the current page.

function Navbar() {
  const navigate = useNavigate()//Returns a function that lets you navigate programmatically.
  const location = useLocation()//Returns information about the current URL, including its pathname.
  const isSignedIn = Boolean(getAuthToken())
  //1. getAuthToken() retrieves the saved token from localStorage.
  //2. Boolean() converts its value into true or false.
  // A non-empty token string	  true
  // null (no token)	          false
  //This variable determines which navigation links to display.

  function handleLogout() {
    logoutUser()
    navigate('/login', { replace: true })//This variable determines which navigation links to display.
  }

  const linkClassName = ({ isActive }) =>`rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive? 'bg-emerald-100 text-emerald-700': 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`

  return (
    <nav className="border-b border-emerald-100 bg-[#f6fcf8]/95 px-4 sm:px-6 lg:px-10 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link to={isSignedIn ? '/dashboard' : '/login'} className="flex items-center gap-2 text-emerald-600">
          <CircleDollarSign aria-hidden="true" className="h-8 w-8 fill-amber-300 stroke-emerald-600"/>
          <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight">
            Penny Flow
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {isSignedIn ? (
            <>
              <NavLink to="/dashboard" className={linkClassName} end aria-current={location.pathname === '/dashboard' ? 'page' : undefined}>
                <span className="flex items-center gap-2">
                  <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
                  Dashboard
                </span>
              </NavLink>
              <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600">
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClassName}>
                Sign in
              </NavLink>
              <NavLink to="/register" className={linkClassName}>
                Create account
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
