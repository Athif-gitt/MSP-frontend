import React, { createContext, useState, useEffect, useContext } from "react"
import { getCurrentUser, login as loginService, logout as logoutService } from "../services/authService"

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (err) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    initAuth()
  }, [])

  const login = async (credentials) => {
    const data = await loginService(credentials)
    // Attempt to set auth globally. Depending on payload, we may need to fetch `/me` again.
    // If backend returns user directly inside login payload:
    if (data.user) {
      setUser(data.user)
    } else {
      // Best effort fallback
      const userData = await getCurrentUser()
      setUser(userData)
    }
  }

  const logout = async () => {
    await logoutService()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}