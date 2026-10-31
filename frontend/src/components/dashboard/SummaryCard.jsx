function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

function SummaryCard({ label, amount, type }) {
  const isIncome = type === 'income'

  return (
    <article className="rounded-[1.8rem] bg-[#f8fffb] px-6 py-8 text-center shadow-[0_8px_15px_rgba(15,61,44,0.28)]">
      <p className={`text-xl font-medium ${isIncome ? 'text-emerald-500' : 'text-red-700'}`}>
        {label}
      </p>
      <p className={`mt-3 text-3xl font-bold sm:text-4xl ${isIncome ? 'text-emerald-500' : 'text-red-800'}`}>
        {formatCurrency(amount)}
      </p>
    </article>
  )
}

export default SummaryCard
