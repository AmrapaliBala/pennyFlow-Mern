import { GoogleGenAI } from '@google/genai'
import Transaction from '../models/Transaction.js'

const DEFAULT_MODEL = 'gemini-3.5-flash-lite'
const LEGACY_MODEL = 'gemini-2.5-flash-lite'
const MAX_LABELS = 10

const monthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

const monthStart = (date, offset = 0) =>
  new Date(date.getFullYear(), date.getMonth() + offset, 1)

const roundAmount = (amount) => Math.round(amount * 100) / 100

const buildFinancialSnapshot = (transactions, now = new Date()) => {
  const currentStart = monthStart(now)
  const previousStart = monthStart(now, -1)
  const nextStart = monthStart(now, 1)
  const monthly = new Map()
  const expenseLabels = new Map()
  let income = 0
  let expense = 0
  let currentMonthIncome = 0
  let currentMonthExpense = 0
  let previousMonthIncome = 0
  let previousMonthExpense = 0

  for (const transaction of transactions) {
    const date = new Date(transaction.createdAt)
    const amount = Number(transaction.amount)
    const key = monthKey(date)
    const totals = monthly.get(key) || { income: 0, expense: 0, count: 0 }
    totals.count += 1

    if (amount > 0) {
      income += amount
      totals.income += amount
      if (date >= currentStart && date < nextStart) currentMonthIncome += amount
      if (date >= previousStart && date < currentStart) previousMonthIncome += amount
    } else {
      const absoluteAmount = Math.abs(amount)
      expense += absoluteAmount
      totals.expense += absoluteAmount

      if (date >= currentStart && date < nextStart) currentMonthExpense += absoluteAmount
      if (date >= previousStart && date < currentStart) previousMonthExpense += absoluteAmount

      const label = transaction.description.trim().slice(0, 80)
      const labelTotals = expenseLabels.get(label) || { total: 0, count: 0 }
      labelTotals.total += absoluteAmount
      labelTotals.count += 1
      expenseLabels.set(label, labelTotals)
    }

    monthly.set(key, totals)
  }

  const monthlyTotals = [...monthly.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .slice(-6)
    .map(([month, totals]) => ({
      month,
      income: roundAmount(totals.income),
      expense: roundAmount(totals.expense),
      count: totals.count,
    }))

  const topExpenseLabels = [...expenseLabels.entries()]
    .sort(([, first], [, second]) => second.total - first.total)
    .slice(0, MAX_LABELS)
    .map(([label, totals]) => ({
      label,
      total: roundAmount(totals.total),
      count: totals.count,
    }))

  return {
    transactionCount: transactions.length,
    lifetime: {
      income: roundAmount(income),
      expense: roundAmount(expense),
      balance: roundAmount(income - expense),
    },
    currentMonth: {
      income: roundAmount(currentMonthIncome),
      expense: roundAmount(currentMonthExpense),
      balance: roundAmount(currentMonthIncome - currentMonthExpense),
    },
    previousMonth: {
      income: roundAmount(previousMonthIncome),
      expense: roundAmount(previousMonthExpense),
      balance: roundAmount(previousMonthIncome - previousMonthExpense),
    },
    monthlyTotals,
    topExpenseLabels,
  }
}

export const createFinancialInsight = async ({ userId, question }) => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('Gemini insights are not configured.')
    error.code = 'GEMINI_NOT_CONFIGURED'
    throw error
  }

  const transactions = await Transaction.find({ user: userId })
    .select('description amount createdAt')
    .lean()
  const snapshot = buildFinancialSnapshot(transactions)
  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      timeout: Number(process.env.GEMINI_TIMEOUT_MS) || 15000,
    },
  })

  const configuredModel = process.env.GEMINI_MODEL?.trim()
  const model = configuredModel === LEGACY_MODEL
    ? DEFAULT_MODEL
    : configuredModel || DEFAULT_MODEL

  const response = await client.models.generateContent({
    model,
    contents: `User question: ${question}\nVerified financial snapshot (JSON): ${JSON.stringify(snapshot)}`,
    config: {
      maxOutputTokens: 500,
      systemInstruction: [
      'You are PennyFlow, a careful personal finance insights assistant.',
      'Use only the verified financial snapshot supplied by the application.',
      'Never invent amounts, dates, categories, transactions, or patterns.',
      'If the snapshot is insufficient, say so clearly.',
      'Expense labels are exact user-entered descriptions, not guaranteed categories.',
      'Explain calculations in plain language and use INR amounts.',
      'Suggestions are general financial guidance, not guaranteed outcomes or professional financial advice.',
      'Do not request or mention passwords, tokens, user IDs, or private account data.',
      ].join(' '),
    },
  })

  const answer = response.text?.trim()

  if (!answer) {
    const error = new Error('Gemini returned an empty insight.')
    error.code = 'GEMINI_EMPTY_RESPONSE'
    throw error
  }

  return { answer, snapshot }
}
