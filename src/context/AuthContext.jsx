import React, { createContext, useState, useEffect, useContext } from "react"
import { getCurrentUser, login as loginService, logout as logoutService } from "../services/authService"
import { ROLE_PERMISSIONS } from "../rbac/permissions"
import { getCurrentUserRole } from "../utils/permissions"

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

  const login = async (credentials, options = {}) => {
    const data = await loginService(credentials, options)
    // Attempt to set auth globally. Depending on payload, we may need to fetch `/me` again.
    // If backend returns user directly inside login payload:
    if (data.user) {
      setUser(data.user)
    } else {
      // Best effort fallback
      const userData = await getCurrentUser()
      setUser(userData)
    }

    return data
  }

  const logout = async (skipRedirect = false) => {
    await logoutService(skipRedirect)
    setUser(null)
  }

  const can = (permission) => {
    if (!user) return false
    const orgId = localStorage.getItem("organization_id")
    const role = getCurrentUserRole(user, orgId)
    if (!role) return false
    const permissions = ROLE_PERMISSIONS[role] || []
    return permissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        login,
        logout,
        isLoading,
        can
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
