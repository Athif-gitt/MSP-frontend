import api from "./api"
import { setAuth } from "../utils/authStore"

export const login = async (credentials) => {
  const res = await api.post("/auth/login/", credentials)

  const { access, refresh, organization_id } = res.data

setAuth(access, refresh, organization_id)

  return res.data
}

export const logout = async () => {
  await api.post("/auth/logout/")
}

export const signup = async (data) => {
  const res = await api.post("/auth/register/", data)
  return res.data
}