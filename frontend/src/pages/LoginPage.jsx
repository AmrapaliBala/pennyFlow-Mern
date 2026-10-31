import { useState } from 'react'//Stores and updates values inside the component.
import { CircleDollarSign, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'//Link Navigates to another route without reloading the entire page.useNavigate	Allows navigation through JavaScript code.
import GoogleSignInButton from '../components/auth/GoogleSignInButton'//Your custom Google sign-in component.
import { loginUser, loginWithGoogle } from '../services/authService'//loginUser Calls the email/password login service.

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)//isSubmitting	false	Tracks whether a login request is in progress.
  const navigate = useNavigate()//useNavigate() returns a function that lets you navigate programmatically.

  async function handleSubmit(event) {
    event.preventDefault()//preventDefault() stops that default behavior so React can handle the submission.
    setError('')//If an earlier login attempt failed, this removes its error message before trying again.
    setIsSubmitting(true)//This records that a login request is in progress.

    try {
      await loginUser({ email, password })//loginUser({ email, password }) calls the imported authentication service with an object containing the user's credentials.
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.',)//?. is optional chaining. It safely accesses a nested property if the preceding value exists. - || provides a fallback if the backend message is missing or otherwise falsy.
    } finally {
      setIsSubmitting(false)//This ensures the loading state is reset after the request finishes.
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    //If Google doesn't provide a credential, the function sets an error and exits early. The return prevents the remaining code from running.
    if (!credentialResponse.credential) {
      setError('Google sign-in did not return a credential.')
      return
    }
    //Clear errors and enable loading.
    setError('')
    setIsSubmitting(true)

    try {
      await loginWithGoogle(credentialResponse.credential)//Send the credential to your authentication service.The service sends the credential for your backend to verify and process.
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message ||'Google sign-in could not be completed. Please try again.',)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50 px-4 sm:px-6 lg:px-10 py-8 text-slate-800">
      <section id="login" className="container relative mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] max-w-2xl">{/* <section> groups the login section. */}
        <div className="w-full rounded-[2rem] bg-[#f6fcf8]/95 px-6 sm:px-10 py-10 shadow-[0_16px_40px_rgba(20,83,45,0.28)]">
          <header className="text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-500">
              <CircleDollarSign aria-hidden="true" className="h-9 w-9 fill-amber-300 stroke-emerald-600"/>{/* aria-hidden="true" → hide from assistive technologies, not visually. */}
              <h1 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">
                Penny Flow
              </h1>
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              Sign in to your account
            </h2>
            <p className="mt-3 text-slate-600">
              Continue keeping your spending on track.
            </p>
          </header>

          <form className="mt-8 rounded-[1.5rem] bg-[#f8fffb] p-6 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.22)]" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <label className="block">
                <span className="text-lg text-slate-700">Email address</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
              </label>

              <label className="block">
                <span className="text-lg text-slate-700">Password</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
              </label>
            </div>

            <p className="mt-3 text-right text-sm">
              <Link to="/forgot-password" className="font-semibold text-emerald-700 underline">
                Forgot password?
              </Link>
            </p>

            {error && (
              <p role="alert" className="mt-5 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
              {/* The type="submit" attribute tells the browser that this button should submit its containing form. When the user clicks it, the form's onSubmit handler runs. The browser also performs its built-in validation first, so required fields must be valid before submission proceeds.*/}
              {/*disabled={isSubmitting} This disables the button while the login request is being processed.When the request starts, isSubmitting becomes true, and the button is disabled.After the request finishes, your finally block runs:setIsSubmitting(false)The button becomes enabled again.*/}
              <LogIn aria-hidden="true" className="h-5 w-5" />
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in was cancelled or failed.')}/>
            {/* You pass the handleGoogleSuccess function as a prop.When Google authentication succeeds, the GoogleSignInButton component can call this function with the credential response.Your function then checks the credential, calls loginWithGoogle(), and navigates to /dashboard if the login succeeds.Notice that you're passing the function itself, not calling it immediately. */}
            {/* This is an arrow function.When the child component invokes onError, the function updates your error state with the specified message. */}
            {/* The error can then appear in this part of your login form:
            {error && (
              <p role="alert">
                {error}
              </p>
            )} */}
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New to Penny Flow?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
