import { useLocation } from 'react-router-dom'//useLocation — a React Router hook that gives information about the current URL.
import Footer from './Footer'
import Navbar from './Navbar'

function Layout({ children }) {
  // Here, {children} represents whatever is placed between <Layout> and </Layout> — in your case, the Routes component.
  const { pathname } = useLocation()//useLocation() returns an object containing information about the current location.
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password'

  if (isAuthPage) {//Conditionally rendering the pages
    return children
  }
//If isAuthPage is true, the component returns children immediately.That means the page content renders without the Navbar and Footer wrapper.For example, when the URL is /login, the login page is displayed without the shared layout.
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50">{/* min-h-screen	Sets the minimum height to the full screen height. */}
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout

// For example, it might return an object like this:
// {
//   pathname: '/login',
//   search: '',
//   hash: ''
// }


// Here, { pathname } uses destructuring to extract only the pathname property
// Therefore, if the browser URL is http://localhost:5173/login, then: pathname = '/login'