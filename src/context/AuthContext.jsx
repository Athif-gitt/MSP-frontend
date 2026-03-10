import { createContext, useState } from "react"
import { login as loginService } from "../services/authService"
import { setAuth } from "../utils/authStore"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(null)
  const [organizationId, setOrganizationId] = useState(null)
  const [user, setUser] = useState(null)

  const login = async (credentials) => {
    const data = await loginService(credentials)

    const { access, organization_id, user } = data

    setToken(access)
    setOrganizationId(organization_id)
    setUser(user)
  }

  const logout = () => {
    setToken(null)
    setOrganizationId(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        organizationId,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}