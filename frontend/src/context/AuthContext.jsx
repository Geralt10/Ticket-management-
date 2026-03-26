import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, getErrorMessage, getStoredToken, storeToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!getStoredToken()) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/user')
        setUser(response.data.user)
      } catch {
        storeToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      async login(payload) {
        const response = await api.post('/login', payload)
        storeToken(response.data.token)
        setUser(response.data.user)
        return response.data.user
      },
      async register(payload) {
        const response = await api.post('/register', payload)
        storeToken(response.data.token)
        setUser(response.data.user)
        return response.data.user
      },
      async logout() {
        try {
          await api.post('/logout')
        } catch {
          // Ignore logout failures and clear local auth state anyway.
        } finally {
          storeToken(null)
          setUser(null)
        }
      },
      getErrorMessage,
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
