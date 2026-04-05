import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import { requestPasswordReset } from "../services/authService";
import { ROUTES } from "../config/routes";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      await requestPasswordReset(email);
      setIsSuccess(true);
    } catch (err) {
      const apiError = err?.response?.data;
      setError(
        apiError?.detail ||
          "We couldn't send the reset email right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a password reset link."
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
            <h3 className="text-lg font-semibold text-gray-900">Check your inbox</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              If an account exists for <span className="font-medium text-gray-900">{email}</span>,
              a password reset email has been sent.
            </p>
          </div>

          <Link
            to={ROUTES.LOGIN}
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Back to login
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
            id="email"
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link to={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-700">
              Return to login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
