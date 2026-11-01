import { useState } from 'react'
import { CircleDollarSign, UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import { loginWithGoogle, registerUser } from '../services/authService'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setIsSubmitting(true)

    try {
      await registerUser({ name, email, password })
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message ||'Unable to create your account. Please try again.',)
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
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50 px-4 sm:px-6 lg:px-10 py-8 text-slate-800">
      <section id="register" className="container relative mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] max-w-2xl">
        <div className="w-full rounded-[2rem] bg-[#f6fcf8]/95 px-6 sm:px-10 py-10 shadow-[0_16px_40px_rgba(20,83,45,0.28)]">
          <header className="text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-500">
              <CircleDollarSign aria-hidden="true" className="h-9 w-9 fill-amber-300 stroke-emerald-600"/>
              <h1 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">
                Penny Flow
              </h1>
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Get started
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              Create your account
            </h2>
            <p className="mt-3 text-slate-600">
              Start making every rupee count.
            </p>
          </header>

          <form className="mt-8 rounded-[1.5rem] bg-[#f8fffb] p-6 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.22)]" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <label className="block">
                <span className="text-lg text-slate-700">Full name</span>
                <input  type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
              </label>

              <label className="block">
                <span className="text-lg text-slate-700">Email address</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
              </label>

              <label className="block">
                <span className="text-lg text-slate-700">Password</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" minLength="6" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
              </label>

              <label className="block">
                <span className="text-lg text-slate-700">Confirm password</span>
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" minLength="6" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
              </label>
            </div>

            {error && (
              <p role="status" className="mt-5 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
              <UserPlus aria-hidden="true" className="h-5 w-5" />
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>

            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in was cancelled or failed.')}/>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
