import React from "react"
import { Navigate, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PublicRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    )
  }

  if (user) {
    // If accessing login/register but already logged in, go to dashboard.
    // Preserving the previous intended route logic or just strictly dashboard.
    const searchParams = new URLSearchParams(location.search)
    const next = searchParams.get('next')
    return <Navigate to={next || "/dashboard"} replace />
  }

  return <Outlet />
}
