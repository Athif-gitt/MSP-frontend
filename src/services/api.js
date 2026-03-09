import axios from "axios";
import { getToken, getOrgId, getRefreshToken, setToken, logout } from "../utils/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
REQUEST INTERCEPTOR
Attach access token + organization id
*/
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    const orgId = getOrgId();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (orgId) {
      config.headers["X-Organization-ID"] = orgId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
RESPONSE INTERCEPTOR
Auto refresh access token when 401 occurs
*/
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        const response = await api.post("/auth/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // save new access token
        setToken(newAccessToken);

        // update header and retry request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        logout();
      }
    }

    return Promise.reject(error);
  }
);


export default api;