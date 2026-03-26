import axios from 'axios'

const tokenStorageKey = 'ticket-management-token'

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(tokenStorageKey)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getStoredToken() {
  return window.localStorage.getItem(tokenStorageKey)
}

export function storeToken(token) {
  if (token) {
    window.localStorage.setItem(tokenStorageKey, token)
  } else {
    window.localStorage.removeItem(tokenStorageKey)
  }
}

export function getErrorMessage(error) {
  const validation = error?.response?.data?.errors

  if (validation) {
    const firstField = Object.values(validation)[0]
    if (Array.isArray(firstField) && firstField.length > 0) {
      return firstField[0]
    }
  }

  return error?.response?.data?.message ?? 'Something went wrong. Please try again.'
}
