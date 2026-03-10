let accessToken = null
let refreshToken = null
let organizationId = null
let currentUser = null

export const setAuth = (access, refresh, orgId) => {
  accessToken = access
  refreshToken = refresh
  organizationId = orgId
}

export const getToken = () => accessToken

export const getRefreshToken = () => refreshToken

export const getOrgId = () => organizationId

export const getUser = () => currentUser

export const setUser = (user) => {
  currentUser = user
}

export const setToken = (token) => {
  accessToken = token
}

export const logout = () => {
  accessToken = null
  refreshToken = null
  organizationId = null
  currentUser = null

  // Cleanly navigate to login if not already there, wiping state
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login"
  }
}

export const isAuthenticated = () => {
  // A valid session requires both token and organizationId
  return !!accessToken && !!organizationId
}