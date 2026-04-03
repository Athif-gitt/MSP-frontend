import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useValidateInvitation, useAcceptInvitation } from "./hooks";
import InviteCard from "./components/InviteCard";
import InviteError from "./components/InviteError";
import InviteSuccess from "./components/InviteSuccess";
import { ROUTES } from "../../config/routes";
import { getCurrentUser } from "../../services/authService";
import { setOrgId } from "../../utils/authStore";

export default function InvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, setUser, isLoading: isAuthLoading, logout } = useAuth();
  
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate the invitation
  const { 
    data: inviteData, 
    isLoading: isValLoading, 
    isError: isValError,
    error: valError
  } = useValidateInvitation(token);

  // Accept mutation
  const { 
    mutate: acceptInvite, 
    isPending: isAccepting 
  } = useAcceptInvitation();

  useEffect(() => {
    // If auth is loaded, and we have a valid invite
    if (!isAuthLoading && !isValLoading && inviteData && !isValError) {
      if (!user) {
        // CASE A: Not authenticated
        // Redirect to register, passing the invitation token so it forces Invite Mode
        navigate(`${ROUTES.REGISTER}?invite_token=${token}`, { replace: true });
      }
    }
  }, [user, isAuthLoading, isValLoading, inviteData, isValError, navigate, token]);

  const handleAccept = () => {
    if (!token || !user) return;
    acceptInvite(token, {
      onSuccess: async () => {
        try {
          const refreshedUser = await getCurrentUser();
          setUser(refreshedUser);

          const invitedOrgName =
            inviteData?.organization_name || inviteData?.organization;

          const joinedOrg = refreshedUser?.organizations?.find(
            (org: any) => org.name === invitedOrgName
          );

          if (joinedOrg?.id) {
            setOrgId(String(joinedOrg.id));
          }

          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } catch {
          // If refresh fails, still show success and let normal auth boot recover on navigation.
        } finally {
          setIsSuccess(true);
          setTimeout(() => {
            navigate(ROUTES.DASHBOARD);
          }, 2000);
        }
      },
      onError: (err: any) => {
        // Fallback error handling if API fails specifically on accept
        const msg = err.response?.data?.detail || err.response?.data?.message || "Failed to accept invitation";
        alert(msg);
      }
    });
  };

  const handleSwitchAccount = async () => {
    await logout(true);
    // After logout, it becomes unauthenticated, which triggers CASE A
    // Alternatively, we can just navigate to login
    const currentPath = location.pathname + location.search;
    navigate(`${ROUTES.LOGIN}?next=${encodeURIComponent(currentPath)}`);
  };

  // 1. Missing token
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <InviteError message="No invitation token provided. Please check your link." />
      </div>
    );
  }

  // 2. Loading state (Validating / Auth Checking)
  if (isAuthLoading || isValLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-500 font-medium tracking-wide">Validating invitation...</p>
      </div>
    );
  }

  // 3. Error validating (Invalid / Expired)
  if (isValError) {
    const errorMsg = (valError as any)?.response?.data?.detail || "This invitation is invalid or has expired.";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <InviteError message={errorMsg} />
      </div>
    );
  }

  // 4. Redirecting to register (prevent flash of content)
  if (!user && inviteData) {
    return null; 
  }

  // CASE B: Authenticated but email mismatch
  if (user && inviteData && user.email !== inviteData.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Mismatch</h2>
          <p className="text-gray-600 mb-6">
            This invitation was sent to <span className="font-semibold text-gray-900">{inviteData.email}</span>, 
            but you are currently logged in as <span className="font-semibold text-gray-900">{user.email}</span>.
          </p>
          <div className="flex flex-col gap-3">
             <button
               onClick={handleSwitchAccount}
               className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition"
             >
               Switch Account
             </button>
             <button
               onClick={() => navigate(ROUTES.DASHBOARD)}
               className="w-full bg-white text-gray-700 bg-gray-50 border border-gray-200 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-100 transition"
             >
               Go to Dashboard
             </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE C: Valid state (Logged in, Token Valid, Email Matches)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {isSuccess ? (
        <InviteSuccess
          organizationName={
            inviteData?.organization_name || inviteData?.organization || "the organization"
          }
        />
      ) : (
        <InviteCard
          organizationName={
            inviteData?.organization_name || inviteData?.organization || "Organization"
          }
          role={inviteData?.role || "Member"}
          invitedByEmail={inviteData?.invited_by_email || "the admin"}
          onAccept={handleAccept}
          isAccepting={isAccepting}
        />
      )}
    </div>
  );
}
