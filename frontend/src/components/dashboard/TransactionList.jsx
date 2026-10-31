import { ReceiptText, Trash2 } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Math.abs(amount))
}

function TransactionList({ transactions, onDelete }) {
  return (
    <section aria-labelledby="transactions-title" className="flex flex-col lg:h-full lg:min-h-0 rounded-[1.5rem] bg-[#f8fffb] p-6 shadow-[0_8px_15px_rgba(15,61,44,0.28)] sm:p-7">
      <div className="flex items-center gap-3">
        <ReceiptText aria-hidden="true" className="h-6 w-6 text-emerald-600" />
        <h2 id="transactions-title" className="text-2xl font-medium text-slate-800">
          Transactions
        </h2>
      </div>

      {transactions.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-white/60 px-6 py-10 text-center text-slate-500">
          No transactions yet. Add one to start tracking your money.
        </div>
      ) : (
        <ul className="lg:flex-1 mt-5 min-h-0 max-h-[24rem] space-y-4 overflow-y-auto pr-2">
          {transactions.map((transaction) => { const isIncome = transaction.amount > 0

            return (
              <li key={transaction._id} className={`flex items-center gap-4 overflow-hidden rounded-2xl bg-white px-5 py-5 m-2.5 shadow-[0_6px_13px_rgba(15,61,44,0.24)] border-r-8 ${isIncome ? 'border-emerald-500' : 'border-red-500'}`}>
                <span className={`h-3 w-3 shrink-0 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-red-500'}`}/>
               <p className="min-w-0 flex-1 truncate text-lg text-slate-700">
                {transaction.description.charAt(0).toUpperCase() +transaction.description.slice(1)}
               </p>
                <p className={`whitespace-nowrap text-lg font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-700'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <button type="button" onClick={() => onDelete(transaction._id)} className="rounded-lg p-2 text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" aria-label={`Delete ${transaction.description}`}>
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default TransactionList
