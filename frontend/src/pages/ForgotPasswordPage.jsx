import { useState } from 'react'//useState lets the component store information that can change while the user interacts with the page.
import { CircleDollarSign, KeyRound, MailCheck, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {requestPasswordReset,resetPassword,verifyPasswordResetOtp,} from '../services/authService'

function ForgotPasswordPage() {// This declares a React function component named ForgotPasswordPage.
  const [step, setStep] = useState('request')//step Initial value: 'request'Tracks which of the four screens should be displayed.
  //When the page first loads, the user should see the email form. Therefore, the initial step is 'request'.
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')//Stores the six-digit verification code.
  const [password, setPassword] = useState('')//Stores the new password entered by the user.
  const [confirmPassword, setConfirmPassword] = useState('')//Stores the password entered in the confirmation field.
  const [resetToken, setResetToken] = useState('')//Stores the temporary token returned after successful OTP verification.
  //- resetToken is a temporary token the backend returns after the OTP is successfully verified.
  //The reset token proves that the verification stage succeeded and is used when submitting the new password. The backend must validate it before allowing the password change.
  const [message, setMessage] = useState('')//Stores a success or informational message from the backend.
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()//You could use a Link for a normal clickable navigation link, but navigate() is useful when you want navigation to happen after an action, such as completing the password reset.

  const getErrorMessage = (requestError, fallbackMessage) =>requestError.response?.data?.message || fallbackMessage
  //This tries to read the error message returned by your backend through Axios.
  //?. It's called optional chaining. It lets JavaScript safely access a property when an earlier property might be null or undefined.
  //|| mean here If the backend message exists, use it. Otherwise, use the fallback message supplied by the caller.
  
  async function requestCode(event) {
  //This function handles the first step: requesting the reset code.
    event.preventDefault()
    setError('')//Clear any previous error.
    setMessage('')//Clear any previous success message.
    setIsSubmitting(true)//Mark the form as submitting.

    try {
      const response = await requestPasswordReset({ email })
      setMessage(response.message)
      setStep('verify')//The current step changes to 'verify'.
    } catch (requestError) {
      setError(getErrorMessage(requestError,'Unable to request a reset code. Please try again.',),)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function verifyCode(event) {
    //This function follows almost the same structure as requestCode(), but it verifies the OTP.
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await verifyPasswordResetOtp({ email, otp })//It sends both the email and the entered OTP to the backend.
      setResetToken(response.resetToken)//saves the temporary reset token returned by the backend.
      setMessage(response.message)
      setStep('reset')//switches to the new-password form.
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to verify the reset code.'),)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function savePassword(event) {
    //This function submits the new password.
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return//Here, return immediately exits the function. The API request is not sent.
    }

    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await resetPassword({ email, password, resetToken })
      //resetToken proves that the OTP-verification step succeeded.
      setMessage(response.message)
      setStep('complete')//If the backend confirms success, the component changes to the final screen.
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to reset your password.'),)
    } finally {
      setIsSubmitting(false)
    }
  }

//   Imagine a JavaScript object as a container that stores related information using key-value pairs.
// Here, the main keys are request, verify, reset, and complete. Each key contains another object with four properties.
  const content = {
    request: {
      icon: MailCheck,
      label: 'Password recovery',
      title: 'Reset your password',
      description: 'Enter your email and we will send a reset code.',
    },
    verify: {
      icon: ShieldCheck,
      label: 'Verify your code',
      title: 'Check your inbox',
      description: 'Enter the six-digit code we sent to your email.',
    },
    reset: {
      icon: KeyRound,
      label: 'New password',
      title: 'Choose a new password',
      description: 'Your new password must be at least six characters long.',
    },
    complete: {
      icon: ShieldCheck,
      label: 'Password updated',
      title: 'You are ready to sign in',
      description: 'Your previous sign-in sessions have been invalidated.',
    },
  }[step]
  //your code adds [step] immediately after the object. This selects a particular property using the current value of the step variable.This is called property access using a variable, or dynamic property access.
  //Why inside the component?Because content depends on step, which is a state variable belonging to this component.
  const StepIcon = content.icon

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50 px-4 sm:px-6 lg:px-10 py-8 text-slate-800">{/* min-h-screen	Minimum height is the screen height. */}
      <section className="container relative mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] max-w-2xl">
        <div className="w-full rounded-[2rem] bg-[#f6fcf8]/95 px-6 sm:px-10 py-10 shadow-[0_16px_40px_rgba(20,83,45,0.28)]">
          <header className="text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-500">
              <CircleDollarSign aria-hidden="true" className="h-9 w-9 fill-amber-300"/>
              <h1 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">
                Penny Flow
              </h1>
            </div>

            <div className="mx-auto mt-8 flex items-center justify-center h-14 w-14  rounded-2xl bg-emerald-100 text-emerald-600">
              <StepIcon aria-hidden="true" className="h-7 w-7" />
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              {content.label}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {content.title}
            </h2>

            <p className="mt-3 text-slate-600">{content.description}</p>
          </header>

          {message && (
            <p className="mt-6 rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          {step === 'request' && (//This condition determines whether the email form appears.
            <form className="mt-8 rounded-[1.5rem] bg-[#f8fffb] p-6 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.22)]" onSubmit={requestCode}>
              <label className="block">
                <span className="text-lg text-slate-700">Email address</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500" />
              </label>
              <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-4 text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Sending code...' : 'Send reset code'}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form className="mt-8 rounded-[1.5rem] bg-[#f8fffb] p-6 shadow-[0_8px_15px_rgba(15,61,44,0.22)] sm:p-7" onSubmit={verifyCode}>
              <label className="block">
                <span className="text-lg text-slate-700">Reset code</span>
                {/* inputMode="numeric" — encourages mobile browsers to display a numeric keyboard. */}
                <input inputMode="numeric" pattern="[0-9]{6}" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Six-digit code" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500" />
                {/* replace(/\D/g, '') — removes non-digit characters. */}
              </label>
              <button type="submit" disabled={isSubmitting || otp.length !== 6} className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-4 text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Verifying code...' : 'Verify code'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form className="mt-8 rounded-[1.5rem] bg-[#f8fffb] p-6 shadow-[0_8px_15px_rgba(15,61,44,0.22)] sm:p-7" onSubmit={savePassword}>
              <div className="space-y-5">
                <label className="block">
                  <span className="text-lg text-slate-700">New password</span>
                  {/* type="password" — masks the entered characters. */}
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="6" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500" />
                </label>

                <label className="block">
                  <span className="text-lg text-slate-700">Confirm new password</span>
                  <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength="6" required className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500" />
                </label>
              </div>
              <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-4 text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Updating password...' : 'Update password'}
              </button>
            </form>
          )}

          {step === 'complete' && (
            <button type="button" onClick={() => navigate('/login')} className="mt-8 w-full rounded-xl bg-emerald-500 px-5 py-4 text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600">
              Return to sign in
            </button>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link to="/login" className="font-semibold text-emerald-700 underline">
              Return to sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default ForgotPasswordPage

// 1. Page loads: step = 'request', so the email form appears.
// 2. Request OTP: The user enters their email and submits. requestCode() calls the backend through requestPasswordReset({ email }). The button shows a loading state while waiting.
// 3. Handle response: On success, setStep('verify') displays the OTP form. On failure, an error message appears. finally resets the loading state.
// 4. Verify OTP: The user enters the six-digit OTP. verifyCode() sends { email, otp } to the backend. If valid, the returned resetToken is saved and setStep('reset') displays the new-password form.
// 5. Reset password: The user enters and confirms the new password. savePassword() checks whether they match. If they do, it sends { email, password, resetToken } to the backend.
// 6. Complete: If the backend successfully updates the password, setStep('complete') displays the success screen. Clicking the button runs navigate('/login') to return to the login page.