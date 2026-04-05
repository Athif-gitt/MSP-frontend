import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ROUTES } from "../config/routes"

function getLoginErrorMessage(error) {
  if (error?.code === "NO_ORGANIZATION") {
    return "Your account is not linked to any organization yet. Open your invitation link first or contact your admin."
  }

  const apiError = error?.response?.data

  if (typeof apiError === "string") {
    return apiError
  }

  if (Array.isArray(apiError?.non_field_errors) && apiError.non_field_errors[0]) {
    return apiError.non_field_errors[0]
  }

  if (typeof apiError?.detail === "string") {
    return apiError.detail
  }

  return "Invalid credentials"
}

export default function Login() {

  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()
  const searchParams = new URLSearchParams(location.search)
  const next = searchParams.get("next")
  const isInviteLogin = !!next?.startsWith("/invite/")

  useEffect(() => {
    if (user) {
      navigate(next || "/dashboard", { replace: true })
    }
  }, [user, navigate, next])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      await login({
        email,
        password
      }, {
        allowWithoutOrganization: isInviteLogin,
      })

      navigate(next || "/dashboard")

    } catch (err) {
      setError(getLoginErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login to MSP
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link className="text-blue-600" to={ROUTES.REGISTER}>
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}
