import { useEffect, useState } from 'react'
import { CircleDollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BalanceSummary from '../components/dashboard/BalanceSummary'
import TransactionForm from '../components/dashboard/TransactionForm'
import TransactionList from '../components/dashboard/TransactionList'
import InsightsAssistant from '../components/dashboard/InsightsAssistant'
import { getAuthToken, logoutUser } from '../services/authService'
import {createTransaction,deleteTransaction as deleteTransactionRequest,getDashboardSummary,getTransactions,} from '../services/transactionService'

function DashboardPage() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()


  function handleUnauthenticatedAccess() {
    logoutUser()
    navigate('/login', { replace: true })
  }

  function getRequestErrorMessage(requestError, fallbackMessage) {
    if (requestError.response?.status === 401) {
      handleUnauthenticatedAccess()
      return ''
    }
    return requestError.response?.data?.message || fallbackMessage
  }

  useEffect(() => {
    let isActive = true
    if (!getAuthToken()) {
      logoutUser()
      navigate('/login', { replace: true })
      return () => {
        isActive = false
      }
    }
    Promise.all([getTransactions(), getDashboardSummary()])
      .then(([transactionData, summaryData]) => {
        if (!isActive) {
          return
        }
        setTransactions(transactionData)
        setSummary(summaryData)
      })
      .catch((requestError) => {
        if (!isActive) {
          return
        }
        if (requestError.response?.status === 401) {
          logoutUser()
          navigate('/login', { replace: true })
          return
        }
        setError(requestError.response?.data?.message ||'Unable to load your transactions. Please try again.',)
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })
    return () => {
      isActive = false
    }
  }, [navigate])

  async function addTransaction(transaction) {
    setError('')
    try {
      const newTransaction = await createTransaction(transaction)
      const updatedSummary = await getDashboardSummary()

      setTransactions((currentTransactions) => [newTransaction,...currentTransactions,])
      setSummary(updatedSummary)
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError,'Unable to add transaction. Please try again.',),)
    }
  }

  async function deleteTransaction(transactionId) {
    setError('')
    try {
      await deleteTransactionRequest(transactionId)
      const updatedSummary = await getDashboardSummary()

      setTransactions((currentTransactions) =>
        currentTransactions.filter((transaction) => transaction._id !== transactionId,),
      )
      setSummary(updatedSummary)
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError,'Unable to delete transaction. Please try again.',),)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-[#e7f7ef] to-emerald-50 px-4 sm:px-6 lg:px-10 py-8 text-slate-800">
      <section id="dashboard" className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#f6fcf8]/95 px-5 sm:px-8 lg:px-10 py-8 lg:py-10 shadow-[0_16px_40px_rgba(20,83,45,0.28)]">
        <header className="flex items-center justify-center gap-2 text-emerald-500">
          <CircleDollarSign aria-hidden="true" className="h-9 w-9 fill-amber-300 stroke-emerald-600"/>
          <h1 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">
            Penny Flow
          </h1>
        </header>

        {error && (
          <p role="alert" className="mt-8 rounded-xl bg-red-100 px-4 py-3 text-center text-sm text-red-800">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="mt-8 text-center text-slate-600">
            Loading your transactions...
          </p>
        ) : (
          <>
            <div className="mt-8">
              <BalanceSummary {...summary} />
            </div>

            <div className="mt-10 grid lg:grid-cols-[1fr_0.92fr] gap-8 lg:h-[28rem] lg:items-stretch">
              <TransactionList transactions={transactions} onDelete={deleteTransaction}/>
              <TransactionForm onAddTransaction={addTransaction} />
            </div>

            <InsightsAssistant />
          </>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
