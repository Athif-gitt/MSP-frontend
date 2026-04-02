import api from "./api"
import { setAuth, setUser, logout as clearAuth } from "../utils/authStore"

export const login = async (credentials) => {
  const res = await api.post("/auth/login/", credentials)
  const { access, refresh, organization_id, user } = res.data

  setAuth(access, refresh, organization_id)
  if (user) {
    setUser(user)
  }

  return res.data
}

export const logout = async (skipRedirect = false) => {
  try {
    await api.post("/auth/logout/")
  } catch (error) {
    // Ignore server error and still clear local auth state
    console.warn("Logout API returned error:", error)
  } finally {
    clearAuth(skipRedirect)
  }
}

export const signup = async (data) => {
  const res = await api.post("/auth/register/", data)
  return res.data
}

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me/")
  return res.data
}

export const updateProfile = async (data) => {
  const res = await api.patch("/auth/me/", data)
  return res.data
}