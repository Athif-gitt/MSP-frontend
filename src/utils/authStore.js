let accessToken = null
let refreshToken = null
let organizationId = null

export const setAuth = (access, refresh, orgId) => {
  accessToken = access
  refreshToken = refresh
  organizationId = orgId
}

export const getToken = () => accessToken

export const getRefreshToken = () => refreshToken

export const getOrgId = () => organizationId

export const setToken = (token) => {
  accessToken = token
}

export const logout = () => {
  accessToken = null
  refreshToken = null
  organizationId = null
}

export const isAuthenticated = () => {
  return !!accessToken
}