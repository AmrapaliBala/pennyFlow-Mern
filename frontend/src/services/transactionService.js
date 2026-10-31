import apiClient from './apiClient'

export const getTransactions = async () => {
  const response = await apiClient.get('/transactions')
  return response.data
}

export const createTransaction = async (transaction) => {
  const response = await apiClient.post('/transactions', transaction)
  return response.data
}

export const deleteTransaction = async (transactionId) => {
  const response = await apiClient.delete(`/transactions/${transactionId}`)
  return response.data
}

export const getDashboardSummary = async () => {
  const response = await apiClient.get('/transactions/summary')
  return response.data
}
