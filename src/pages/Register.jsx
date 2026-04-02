import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import AuthLayout from "../components/auth/AuthLayout"
import RegisterForm from "../components/auth/RegisterForm"
import { useValidateInvitation } from "../features/invitations/hooks"

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get("invite_token")
  const navigate = useNavigate()

  const { data: inviteData, isLoading, isError } = useValidateInvitation(inviteToken)

  const isInviteMode = !!inviteToken

  if (isInviteMode && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    )
  }

  if (isInviteMode && isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col">
        <h2 className="text-xl font-bold mb-4">Invalid Invitation</h2>
        <p className="text-gray-500 mb-6">This invitation link is invalid or has expired.</p>
        <Link to="/register" className="text-blue-600 hover:underline">
          Create a new workspace instead
        </Link>
      </div>
    )
  }

  const title = isInviteMode && inviteData
    ? `Join ${inviteData.organization_name}`
    : "Create your workspace"

  const handleSuccess = (data) => {
    // If backend logs user in automatically, we could redirect based on mode.
    // If backend just sends email, we show the success UI.
    // According to instructions: 
    // Invite Mode -> Store JWT, Redirect -> /invite?token=XYZ
    // Normal Mode -> Redirect -> /dashboard
    
    // We will pass this responsibility to the Form or AuthContext if tokens are returned, 
    // but typically we can check if token is returned.
    
    // Let's assume Form handles login side-effects and we just need to redirect.
    if (data?.access) {
      if (isInviteMode) {
        navigate(`/invite/${inviteToken}`);
      } else {
        navigate('/dashboard');
      }
    } else {
      setIsSuccess(true);
    }
  }

  return (
    <AuthLayout
      title={title}
      subtitle={
        isSuccess ? null : (
          <>
            Already have an account?{" "}
            <Link to={`/login${inviteToken ? `?next=/invite/${inviteToken}` : ''}`} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Login
            </Link>
          </>
        )
      }
    >
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-green-100 mb-4 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Registration Completed</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Please proceed to login to access your account.
            </p>
            <Link
              to={`/login${inviteToken ? `?next=/invite/${inviteToken}` : ''}`}
              className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Return to login
            </Link>
          </div>
        </div>
      ) : (
        <RegisterForm 
          onSuccess={handleSuccess} 
          inviteData={isInviteMode ? inviteData : null} 
          inviteToken={inviteToken}
        />
      )}
    </AuthLayout>
  )
}