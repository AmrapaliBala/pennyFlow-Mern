import SummaryCard from './SummaryCard'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

function BalanceSummary({ balance, income, expense }) {
  return (
    <section aria-label="Financial summary" className="rounded-[1.8rem] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-200 px-5 py-9 shadow-[0_12px_18px_rgba(15,61,44,0.35)] sm:px-9">
      <div className="text-center">
        <p className="text-xl font-medium text-slate-700">Your Balance</p>
        <p className="mt-4 text-4xl font-bold tracking-tight text-slate-700 sm:text-6xl">
          {formatCurrency(balance)}
        </p>
      </div>

      <div className="mt-9 grid gap-6 md:grid-cols-2 md:gap-8">
        <SummaryCard label="Income" amount={income} type="income" />
        <SummaryCard label="Expense" amount={expense} type="expense" />
      </div>
    </section>
  )
}

export default BalanceSummary
