import { CircleDollarSign, Home, MapPinOff } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50 px-3 sm:px-6 lg:px-10 py-6 sm:py-8 text-slate-800">
      <section id="not-found" className="container relative mx-auto flex min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[1.5rem] sm:rounded-[2rem] bg-[#f6fcf8]/95 px-4 sm:px-10 py-6 sm:py-14 text-center shadow-[0_16px_40px_rgba(20,83,45,0.28)]">
          <header className="flex items-center justify-center gap-2 text-emerald-500">
            <CircleDollarSign aria-hidden="true" className="h-7 w-7 sm:h-9 sm:w-9 fill-amber-300 stroke-emerald-600"/>
            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">
              Penny Flow
            </h1>
          </header>

          <div className="mt-6 sm:mt-10 rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#f8fffb] px-4 sm:px-10 py-6 sm:py-10 shadow-[0_8px_15px_rgba(15,61,44,0.22)]">
            <div className="mx-auto grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
              <MapPinOff aria-hidden="true" className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Page not found
            </p>

            <p className="mt-2 sm:mt-3 text-5xl sm:text-8xl font-black tracking-tight text-emerald-500">
              404
            </p>

            <h2 className="mt-2.5 sm:mt-4 text-xl sm:text-3xl font-bold text-slate-800">
              This page is out of balance.
            </h2>

            <p className="mx-auto mt-2 sm:mt-4 max-w-md text-xs sm:text-base text-slate-600">
              The page you are looking for does not exist or may have moved.
            </p>

            <Link to="/login" className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
              <Home aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span>Return to sign in</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage
