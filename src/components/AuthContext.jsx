import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('l2_token') || null)
  const [loading, setLoading] = useState(true)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setToken(null)
          localStorage.removeItem('l2_token')
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [token])

  const value = {
    user,
    token,
    loading,
    login: async (username_or_email, password) => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email, password }),
      })
      if (!res.ok) throw new Error('Błędne dane logowania')
      const data = await res.json()
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('l2_token', data.token)
      return true
    },
    register: async (username, email, password) => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      if (!res.ok) throw new Error('Rejestracja nie powiodła się')
      const data = await res.json()
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('l2_token', data.token)
      return true
    },
    logout: async () => {
      if (token) {
        try {
          await fetch(`${baseUrl}/api/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          })
        } catch (e) {}
      }
      setUser(null)
      setToken(null)
      localStorage.removeItem('l2_token')
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
