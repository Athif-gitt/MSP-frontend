import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../services/api";
import InputField from "./InputField";

export default function RegisterForm({ onSuccess, inviteData, inviteToken }) {
  const isInviteMode = !!inviteToken;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    organization_name: "",
  });

  // Pre-fill email when inviteData is loaded
  useEffect(() => {
    if (inviteData?.email) {
      setFormData((prev) => ({ ...prev, email: inviteData.email }));
    }
  }, [inviteData]);

  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) => api.post("/auth/register/", data),
    onSuccess: (response) => {
      if (onSuccess) onSuccess(response.data);
    },
    onError: (error) => {
      const backendErrors = error.response?.data || {};
      const newErrors = {};
      if (backendErrors.email) newErrors.email = backendErrors.email[0];
      if (backendErrors.organization_name) newErrors.organization_name = backendErrors.organization_name[0];
      if (backendErrors.detail) newErrors.general = backendErrors.detail;
      if (Object.keys(newErrors).length === 0) {
        newErrors.general = "An unexpected error occurred. Please try again.";
      }
      setErrors(newErrors);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: null, general: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isInviteMode && !formData.organization_name.trim()) {
      newErrors.organization_name = "Workspace name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      };

      if (isInviteMode) {
        payload.invite_token = inviteToken;
      } else {
        payload.organization_name = formData.organization_name;
      }

      mutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
          {errors.general}
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Your details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InputField
            label="First Name"
            id="first_name"
            name="first_name"
            type="text"
            placeholder="Jane"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
          />
          <InputField
            label="Last Name"
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
          />
        </div>

        <div className="space-y-4">
          <InputField
            label="Email address"
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isInviteMode}
            helperText={isInviteMode ? "Email is locked to the invitation" : ""}
          />
          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
        </div>
      </div>

      {!isInviteMode && (
        <div className="pt-2">
          <div className="border-t border-gray-100 pb-4"></div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Workspace setup</h3>
          <InputField
            label="Workspace Name"
            id="organization_name"
            name="organization_name"
            type="text"
            placeholder="Acme Corp"
            helperText="This will be your workspace name. You can change it later."
            value={formData.organization_name}
            onChange={handleChange}
            error={errors.organization_name}
          />
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            isInviteMode ? "Join workspace" : "Create account"
          )}
        </button>
      </div>
    </form>
  );
}
