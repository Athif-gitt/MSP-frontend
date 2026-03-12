import { Navigate } from "react-router-dom"
import { isAuthenticated } from "../utils/authStore"
import { usePermission } from "../hooks/usePermission"

export default function ProtectedRoute({ permission, children }) {
  const { hasPermission, isLoading } = usePermission();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // If a specific permission is required, check it
  if (permission) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
        </div>
      );
    }

    if (!hasPermission(permission)) {
      // User is authenticated but lacks required permission
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}