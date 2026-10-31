import { CircleDollarSign, Home, MapPinOff } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50 px-4 py-8 text-slate-800 sm:px-6 lg:px-10">
      <section id="not-found" className="container relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2rem] bg-[#f6fcf8]/95 px-6 py-10 text-center shadow-[0_16px_40px_rgba(20,83,45,0.28)] sm:px-10 sm:py-14">
          <header className="flex items-center justify-center gap-2 text-emerald-500">
            <CircleDollarSign aria-hidden="true" className="h-9 w-9 fill-amber-300 stroke-emerald-600"/>
            <h1 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">
              Penny Flow
            </h1>
          </header>

          <div className="mt-10 rounded-[1.5rem] bg-[#f8fffb] px-6 py-10 shadow-[0_8px_15px_rgba(15,61,44,0.22)] sm:px-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
              <MapPinOff aria-hidden="true" className="h-8 w-8" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Page not found
            </p>

            <p className="mt-3 text-7xl font-black tracking-tight text-emerald-500 sm:text-8xl">
              404
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-800">
              This page is out of balance.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-slate-600">
              The page you are looking for does not exist or may have moved.
            </p>

            <Link to="/login" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
              <Home aria-hidden="true" className="h-5 w-5" />
              Return to sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage