import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "../services/authService"
import { isAuthenticated } from "../utils/authStore"

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated(),   // only run when logged in
    staleTime: 1000 * 60 * 10,    // 10 minutes
  })
}

