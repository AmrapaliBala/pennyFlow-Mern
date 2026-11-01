import { useState } from 'react'
import { CircleDollarSign } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetOtp,
} from '../services/authService'

const stepContent = {
  request: {
    title: 'Reset your password',
    description: 'Enter your account email to receive a six-digit verification code.',
  },
  verify: {
    title: 'Enter verification code',
    description: 'Check your email and enter the code sent by PennyFlow.',
  },
  reset: {
    title: 'Choose a new password',
    description: 'Set a strong new password for your account.',
  },
}

function ForgotPasswordPage() {
  const [step, setStep] = useState('request')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function requestCode(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await requestPasswordReset({ email })
      setMessage(response.message || 'If an account exists, a reset code was sent.')
      setStep('verify')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to send reset code. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function verifyCode(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await verifyPasswordResetOtp({ email, otp })
      setResetToken(response.resetToken)
      setMessage('Code verified. Set your new password.')
      setStep('reset')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Invalid or expired code. Please request a new one.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function savePassword(event) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      await resetPassword({ email, resetToken, password })
      navigate('/login', {
        replace: true,
        state: {
          successMessage: 'Password reset successful. Please sign in with your new password.',
        },
      })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to reset password. Please request a new code.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const content = stepContent[step]

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50 px-3 sm:px-4 py-6 sm:py-10 text-slate-800">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-emerald-500 transition hover:opacity-90"
          >
            <CircleDollarSign
              aria-hidden="true"
              className="h-8 w-8 sm:h-10 sm:w-10 fill-amber-300 stroke-emerald-600"
            />
            <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight">Penny Flow</span>
          </Link>
        </div>

        <div className="mt-6 sm:mt-8 rounded-[1.5rem] sm:rounded-[2rem] bg-[#f6fcf8]/95 p-4 sm:p-8 shadow-[0_16px_40px_rgba(20,83,45,0.28)]">
          <header className="text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">{content.title}</h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600">{content.description}</p>
          </header>

          {message && (
            <p className="mt-4 sm:mt-6 rounded-xl bg-emerald-100 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-emerald-800">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 sm:mt-6 rounded-xl bg-red-100 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-800">
              {error}
            </p>
          )}

          {step === 'request' && (
            <form className="mt-6 sm:mt-8 rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#f8fffb] p-4 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.22)]" onSubmit={requestCode}>
              <label className="block">
                <span className="text-base sm:text-lg text-slate-700">Email address</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="mt-1.5 sm:mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500" />
              </label>
              <button type="submit" disabled={isSubmitting} className="mt-5 sm:mt-6 w-full rounded-xl bg-emerald-500 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Sending code...' : 'Send reset code'}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form className="mt-6 sm:mt-8 rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#f8fffb] p-4 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.22)]" onSubmit={verifyCode}>
              <label className="block">
                <span className="text-base sm:text-lg text-slate-700">Reset code</span>
                <input inputMode="numeric" pattern="[0-9]{6}" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Six-digit code" required className="mt-1.5 sm:mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500" />
              </label>
              <button type="submit" disabled={isSubmitting || otp.length !== 6} className="mt-5 sm:mt-6 w-full rounded-xl bg-emerald-500 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Verifying code...' : 'Verify code'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form className="mt-6 sm:mt-8 rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#f8fffb] p-4 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.22)]" onSubmit={savePassword}>
              <div className="space-y-4 sm:space-y-5">
                <label className="block">
                  <span className="text-base sm:text-lg text-slate-700">New password</span>
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="6" required className="mt-1.5 sm:mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 outline-none transition focus:border-emerald-500" />
                </label>

                <label className="block">
                  <span className="text-base sm:text-lg text-slate-700">Confirm new password</span>
                  <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength="6" required className="mt-1.5 sm:mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 outline-none transition focus:border-emerald-500" />
                </label>
              </div>

              <button type="submit" disabled={isSubmitting} className="mt-5 sm:mt-6 w-full rounded-xl bg-emerald-500 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Updating password...' : 'Update password'}
              </button>
            </form>
          )}

          <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm">
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ForgotPasswordPage
