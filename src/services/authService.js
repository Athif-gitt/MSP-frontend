import api from "./api"
import { setAuth, setUser, logout as clearAuth } from "../utils/authStore"

export const login = async (credentials, options = {}) => {
  const res = await api.post("/auth/login/", credentials)
  const { access, refresh, organization_id, user } = res.data
  const allowWithoutOrganization = !!options.allowWithoutOrganization

  if (!organization_id && !allowWithoutOrganization) {
    clearAuth(true)

    const error = new Error("Your account is not linked to any organization yet.")
    error.code = "NO_ORGANIZATION"
    throw error
  }

  setAuth(access, refresh, organization_id)
  if (user) {
    setUser(user)
  }

  return {
    ...res.data,
    hasOrganization: !!organization_id,
    allowWithoutOrganization,
  }
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

export const requestPasswordReset = async (email) => {
  const res = await api.post("/auth/forgot-password/", { email })
  return res.data
}

export const resetPassword = async ({ token, password }) => {
  const res = await api.post(`/auth/reset-password/?token=${encodeURIComponent(token)}`, {
    password,
  })
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
