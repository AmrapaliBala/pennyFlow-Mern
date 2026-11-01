import { useState } from 'react'
import { MessageCircle, Send, Sparkles } from 'lucide-react'
import { requestFinancialInsight } from '../../services/insightsService'

const exampleQuestions = [
  'Summarise my spending this month.',
  'Compare this month\'s expenses with last month.',
  'Which expense label costs me the most?',
]

function InsightsAssistant() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion) {
      setError('Ask a question about your financial activity.')
      return
    }

    setError('')
    setAnswer('')
    setIsLoading(true)

    try {
      const response = await requestFinancialInsight(trimmedQuestion)
      setAnswer(response.answer)
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        setError('Your session has expired. Please sign in again.')
      } else {
        setError(requestError.response?.data?.message ||'Unable to generate insights right now. Please try again.',)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section aria-labelledby="insights-title" className="mt-10 rounded-[1.5rem] bg-[#f8fffb] p-6 sm:p-7 shadow-[0_8px_15px_rgba(15,61,44,0.28)]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <Sparkles aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 id="insights-title" className="text-2xl font-medium text-slate-800">
            Financial insights
          </h2>
          <p className="text-sm text-slate-600">
            Ask about your own verified PennyFlow activity.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {exampleQuestions.map((exampleQuestion) => (
          <button key={exampleQuestion} type="button" onClick={() => setQuestion(exampleQuestion)} className="rounded-full border border-emerald-200 px-3 py-2 text-left text-xs font-medium text-emerald-700 transition hover:bg-emerald-50">
            {exampleQuestion}
          </button>
        ))}
      </div>

      <form className="mt-5" onSubmit={handleSubmit}>
        <label htmlFor="insights-question" className="sr-only">
          Ask about your finances
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input id="insights-question" value={question} onChange={(event) => setQuestion(event.target.value.slice(0, 500))} placeholder="Ask a question about your finances" maxLength="500" className="min-w-0 flex-1 rounded-xl border-2 border-slate-700 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"/>
          <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-[0_5px_10px_rgba(22,163,74,0.35)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
            <Send aria-hidden="true" className="h-4 w-4" />
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {answer && (
        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm leading-6 text-slate-700">
          <div className="mb-2 flex items-center gap-2 font-semibold text-emerald-700">
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            PennyFlow assistant
          </div>
          <p className="whitespace-pre-line">{answer}</p>
          <p className="mt-3 text-xs text-slate-500">
            General guidance based on your recorded transactions; not guaranteed financial advice.
          </p>
        </div>
      )}
    </section>
  )
}

export default InsightsAssistant
