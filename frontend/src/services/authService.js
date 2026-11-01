import apiClient from './apiClient'

const TOKEN_KEY = 'pennyflow_token'

const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData)
  saveToken(response.data.token)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials)
  saveToken(response.data.token)
  return response.data
}

export const requestPasswordReset = async (emailData) => {
  const response = await apiClient.post('/auth/forgot-password/request', emailData)
  return response.data
}

export const verifyPasswordResetOtp = async (otpData) => {
  const response = await apiClient.post('/auth/forgot-password/verify', otpData)
  return response.data
}

export const resetPassword = async (passwordData) => {
  const response = await apiClient.post('/auth/forgot-password/reset', passwordData)
  return response.data
}

export const loginWithGoogle = async (credential) => {
  const response = await apiClient.post('/auth/google', { credential })
  saveToken(response.data.token)
  return response.data
}

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY)

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY)
}
