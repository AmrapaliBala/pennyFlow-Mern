import { useState } from 'react'
import { CircleDollarSign, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import { loginUser, loginWithGoogle } from '../services/authService'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await loginUser({ email, password })
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.',)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    if (!credentialResponse.credential) {
      setError('Google sign-in did not return a credential.')
      return
    }
    setError('')
    setIsSubmitting(true)

    try {
      await loginWithGoogle(credentialResponse.credential)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message ||'Google sign-in could not be completed. Please try again.',)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50 px-3 sm:px-6 lg:px-10 py-6 sm:py-8 text-slate-800">
      <section id="login" className="container relative mx-auto flex items-center justify-center min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] max-w-2xl">
        <div className="w-full rounded-[1.5rem] sm:rounded-[2rem] bg-[#f6fcf8]/95 px-4 sm:px-10 py-6 sm:py-10 shadow-[0_16px_40px_rgba(20,83,45,0.28)]">
          <header className="text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-500">
              <CircleDollarSign aria-hidden="true" className="h-7 w-7 sm:h-9 sm:w-9 fill-amber-300 stroke-emerald-600"/>
              <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">
                Penny Flow
              </h1>
            </div>

            <p className="mt-4 sm:mt-8 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Welcome back
            </p>
            <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-slate-800">
              Sign in to your account
            </h2>
            <p className="mt-1.5 sm:mt-3 text-sm sm:text-base text-slate-600">
              Continue keeping your spending on track.
            </p>
          </header>

          <form className="mt-6 sm:mt-8 rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#f8fffb] p-4 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.22)]" onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-5">
              <label className="block">
                <span className="text-base sm:text-lg text-slate-700">Email address</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="mt-1.5 sm:mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
              </label>

              <label className="block">
                <span className="text-base sm:text-lg text-slate-700">Password</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required className="mt-1.5 sm:mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
              </label>
            </div>

            <p className="mt-2.5 sm:mt-3 text-right text-xs sm:text-sm">
              <Link to="/forgot-password" className="font-semibold text-emerald-700 underline">
                Forgot password?
              </Link>
            </p>

            {error && (
              <p role="alert" className="mt-4 sm:mt-5 rounded-xl bg-red-100 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-800">
                {error}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="mt-5 sm:mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
              <LogIn aria-hidden="true" className="h-5 w-5" />
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in was cancelled or failed.')}/>
          </form>

          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-slate-600">
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
