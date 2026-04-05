let currentUser = null

export const setAuth = (access, refresh, orgId) => {
  if (access) localStorage.setItem("access_token", access)
  if (refresh) localStorage.setItem("refresh_token", refresh)

  if (orgId) {
    localStorage.setItem("organization_id", orgId)
    return
  }

  localStorage.removeItem("organization_id")
}

export const getToken = () => localStorage.getItem("access_token")

export const getRefreshToken = () => localStorage.getItem("refresh_token")

export const getOrgId = () => localStorage.getItem("organization_id")

export const hasToken = () => !!localStorage.getItem("access_token")

export const hasOrganizationContext = () => !!localStorage.getItem("organization_id")

export const setOrgId = (orgId) => {
  if (orgId) {
    localStorage.setItem("organization_id", orgId)
    return
  }

  localStorage.removeItem("organization_id")
}

export const getUser = () => currentUser

export const setUser = (user) => {
  currentUser = user
}

export const setToken = (token) => {
  if (token) localStorage.setItem("access_token", token)
}

export const logout = (skipRedirect = false) => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("organization_id")
  currentUser = null

  // Cleanly navigate to login if not already there, wiping state
  if (!skipRedirect && typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login"
  }
}

export const isAuthenticated = () => {
  return hasToken()
}
