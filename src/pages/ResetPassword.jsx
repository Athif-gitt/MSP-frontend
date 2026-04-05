import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import { resetPassword } from "../services/authService";
import { ROUTES } from "../config/routes";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const tokenMissing = useMemo(() => !token.trim(), [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (tokenMissing) {
      setError("This password reset link is invalid or incomplete.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword({ token, password });
      setIsSuccess(true);
    } catch (err) {
      const apiError = err?.response?.data;
      setError(
        apiError?.detail ||
          "This reset link is invalid or has expired. Please request a new one."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create a new password"
      subtitle="Choose a strong password for your MSP account."
    >
      {isSuccess ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Password updated</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Continue to login
          </button>
        </div>
      ) : tokenMissing ? (
        <div className="space-y-5 text-center">
          <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            This password reset link is missing a token. Please open the latest reset email and try again.
          </div>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Request a new reset link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error ? (
            <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <InputField
            id="password"
            label="New password"
            name="password"
            type="password"
            placeholder="Enter a new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            helperText="Use at least 8 characters."
            required
          />

          <InputField
            id="confirm_password"
            label="Confirm new password"
            name="confirm_password"
            type="password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Updating password..." : "Reset password"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Back to{" "}
            <Link to={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-700">
              login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
