import apiClient from './apiClient'

export const requestFinancialInsight = async (question) => {
  const response = await apiClient.post('/insights', { question })
  return response.data
}
