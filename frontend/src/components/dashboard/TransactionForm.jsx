import { useState } from 'react'
import { Plus } from 'lucide-react'

function TransactionForm({ onAddTransaction }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const parsedAmount = Number(amount)
    if (!description.trim() || !amount || Number.isNaN(parsedAmount) || parsedAmount === 0) {
      setError('Enter a description and a non-zero amount.')
      return
    }
    onAddTransaction({description: description.trim(),amount: parsedAmount,})
    setDescription('')
    setAmount('')
    setError('')
  }

  return (
    <section aria-labelledby="add-transaction-title" className="rounded-[1.5rem] bg-[#f8fffb] p-5 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.28)] lg:h-full">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <Plus aria-hidden="true" className="h-5 w-5" />
        </span>
        <h2 id="add-transaction-title" className="text-xl sm:text-2xl font-medium text-slate-800">
          Add transaction
        </h2>
      </div>

      <form className="mt-5 sm:mt-6 space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-base sm:text-lg text-slate-700">Description</span>
          <input value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 sm:mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500" placeholder="Enter description"/>
        </label>

        <label className="block">
          <span className="text-base sm:text-lg text-slate-700">Amount</span>
          <input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" step="0.01" className="mt-1.5 sm:mt-2 w-full rounded-xl border-2 border-slate-700 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500" placeholder="Enter amount"/>
          <span className="mt-1.5 sm:mt-2 block text-xs sm:text-sm text-slate-600">
            Use a negative amount for expenses.
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <button type="submit" className="w-full rounded-xl bg-emerald-500 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
          Add transaction
        </button>
      </form>
    </section>
  )
}

export default TransactionForm
