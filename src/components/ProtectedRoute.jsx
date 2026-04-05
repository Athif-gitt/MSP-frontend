import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getOrgId } from "../utils/authStore"

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!getOrgId()) {
    return <Navigate to="/login" replace />
  }

  return children
}
