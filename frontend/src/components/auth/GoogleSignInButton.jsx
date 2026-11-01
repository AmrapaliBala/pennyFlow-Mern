import { GoogleLogin } from '@react-oauth/google'

function GoogleSignInButton({ onSuccess, onError }) {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null
  }

  return (
    <div className="mt-5 sm:mt-6 w-full">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        <span className="h-px flex-1 bg-emerald-100" />
        Or continue with
        <span className="h-px flex-1 bg-emerald-100" />
      </div>
      <div className="mt-4 flex justify-center max-w-full overflow-hidden">
        <GoogleLogin onSuccess={onSuccess} onError={onError} shape="pill" />
      </div>
    </div>
  )
}

export default GoogleSignInButton
