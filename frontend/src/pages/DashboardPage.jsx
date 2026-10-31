import { useEffect, useState } from 'react'
import { CircleDollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BalanceSummary from '../components/dashboard/BalanceSummary'
import TransactionForm from '../components/dashboard/TransactionForm'
import TransactionList from '../components/dashboard/TransactionList'
import InsightsAssistant from '../components/dashboard/InsightsAssistant'
import { getAuthToken, logoutUser } from '../services/authService'
import {createTransaction,deleteTransaction as deleteTransactionRequest,getDashboardSummary,getTransactions,} from '../services/transactionService'
//Why? Because you also define a function named deleteTransaction inside DashboardPage. Renaming the imported function prevents a naming conflict.

function DashboardPage() {
  const [transactions, setTransactions] = useState([])//transactions holds the list of transactions retrieved from your backend.
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  })
  const [isLoading, setIsLoading] = useState(true)//This tracks whether the dashboard is still loading its initial data.It starts as true, so the page can display:Loading your transactions...
  //After the requests finish, setIsLoading(false) allows the dashboard content to appear.
  const [error, setError] = useState('')
  const navigate = useNavigate()

  //Handling unauthenticated access
  function handleUnauthenticatedAccess() {
    logoutUser()
    navigate('/login', { replace: true })
  }

  //Handling API errors This function decides what to do when a transaction-related request fails.
  function getRequestErrorMessage(requestError, fallbackMessage) {
    if (requestError.response?.status === 401) {//401 is an HTTP status code that means Unauthorized.It generally means the request doesn't have valid authentication credentials.
      //If the response is 401, the code logs the user out, redirects them to login, and returns an empty string.
      handleUnauthenticatedAccess()
      return ''//This returns an empty string to the function that called getRequestErrorMessage().
      // When the backend returns a 401 Unauthorized error:
      // 1. handleUnauthenticatedAccess() removes the saved token and redirects the user to the login page.
      // 2. return '' returns an empty string to setError().
      // 3. This clears the dashboard's error message because the user is already being redirected to log in.
    }
    //For other errors:This uses the backend's error message if one exists. Otherwise, it returns the fallback message provided by the caller.
    return requestError.response?.data?.message || fallbackMessage
  }

  useEffect(() => {
    let isActive = true//isActive is a flag (a boolean variable) used to check whether the useEffect is still active or has been cleaned up.Its main purpose is to prevent React state updates from an outdated API request after the component has unmounted or the effect has been cleaned up.
    if (!getAuthToken()) {
      logoutUser()
      navigate('/login', { replace: true })
      return () => {
        isActive = false
      }//This is the cleanup function. React runs it when the effect is cleaned up, such as when the component unmounts or before the effect reruns.
    }

    //getTransactions() requests the transaction list.
    // getDashboardSummary() requests the financial summary.
    // Promise.all() waits for both promises to resolve successfully.
    //Promise.all() returns an array containing the results of both promises, and .then() uses array destructuring to assign those results to separate variables.
    Promise.all([getTransactions(), getDashboardSummary()])
      .then(([transactionData, summaryData]) => {// .then() runs when Promise.all() resolves successfully.One subtle point: because you're using Promise.all(), if either request fails, the .then() block doesn't run, even if the other request succeeded.
        // The array of results is destructured:
        // - transactionData receives the result of getTransactions().summaryData receives the result of getDashboardSummary().
        if (!isActive) {//The if (!isActive) check prevents state updates from this effect if it has already been cleaned up.
          return
        }
        //updates the corresponding React states, causing the component to render with the fetched data.
        setTransactions(transactionData)
        setSummary(summaryData)
      })
      .catch((requestError) => {//.catch() runs if either request in Promise.all() rejects.
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
      .finally(() => {//If the effect is still active, it sets isLoading to false.
        if (isActive) {
          setIsLoading(false)
        }
      })
    return () => {
      isActive = false
    }
  }, [navigate])

//First cleanup: Runs when the user has no authentication token. The user is redirected to login, and the API requests are skipped.
// Second cleanup: Runs when the user has a token and the API requests are executed. It prevents outdated API responses from updating state if the user leaves the dashboard or the effect reruns.

  //This function is called when the user submits the transaction form.
  async function addTransaction(transaction) {
    setError('')//Removes an old error message before attempting the new operation.
    try {
      const newTransaction = await createTransaction(transaction)
      //transaction contains the details entered in the form.
      // createTransaction() sends those details to the backend.// await waits for the request to finish.
      // newTransaction stores the newly created transaction returned by the backend.
      const updatedSummary = await getDashboardSummary()//After creating the transaction, the code requests the latest summary so the income, expenses, and balance reflect the new transaction.

      setTransactions((currentTransactions) => [newTransaction,...currentTransactions,])
      //currentTransactions represents the latest state value. The array creates a new list containing:
      // 1. newTransaction at the beginning. 2. ...currentTransactions, which spreads all existing transactions after it.
      setSummary(updatedSummary)//Stores the latest summary returned by the backend.
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError,'Unable to add transaction. Please try again.',),)
    }
  }

  async function deleteTransaction(transactionId) {
    setError('')
    try {
      await deleteTransactionRequest(transactionId)
      const updatedSummary = await getDashboardSummary()//After deletion, the code retrieves the new totals.

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
              <BalanceSummary {...summary} />{/* This uses the spread operator (...) to pass an object's properties as props to a React component. */}
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

// isActive is a boolean variable used inside useEffect() to prevent outdated API responses from updating React state after the effect has been cleaned up.
// How it works
// 1. Initially, set it to true:
// let isActive = true
// The effect is active, so API responses can update the component's state.
// 2. Check before updating state:
// if (!isActive) {
//   return
// }
// - If isActive is true, continue execution.
// - If isActive is false, exit the callback without updating state.
// 3. Change it to false in the cleanup function:
// return () => {
//   isActive = false
// }

// React runs this cleanup when the component unmounts or before the effect runs again.
// Where is it used? Location	Purpose
// .then()	Prevents outdated successful requests from updating state
// .catch()	Prevents outdated requests from setting error messages
// .finally()	Prevents outdated requests from changing loading state
//  Imagine:
// 1. User opens the dashboard → isActive = true.
// 2. API requests start.
// 3. User leaves the dashboard → cleanup runs and isActive = false.
// 4. API requests finish.
// 5. The callbacks check isActive and exit without updating the component's state.
// Remember isActive does not cancel API requests. It only prevents their results from updating React state after the effect has been cleaned up.

// Transaction deletion flow (short summary)
// 1. MongoDB: Each transaction has a unique _id.
// 2. TransactionList: .map() accesses each transaction. When the user clicks Delete, onDelete(transaction._id) passes that transaction's ID.
// 3. DashboardPage: The onDelete prop is connected to the parent's deleteTransaction function.
// 4. deleteTransaction(transactionId): Receives the ID as its parameter and passes it to deleteTransactionRequest(transactionId) to delete the transaction through the backend API.
// 5. Update frontend state: After successful deletion, .filter() removes the matching transaction from the React state using its _id.
// 6. Update summary: getDashboardSummary() fetches the latest income, expenses and balance.

// TransactionForm and DashboardPage connection
// 1. Import: DashboardPage imports TransactionForm.
// 2. Pass props: addTransaction is passed to the child as onAddTransaction.
// 3. Receive props: TransactionForm receives it through { onAddTransaction }.
// 4. Submit form: The child calls onAddTransaction(formData) with the description and amount.
// 5. Backend request: The parent's addTransaction() receives the data, sends it to the backend and updates the dashboard