import axios from "axios";
import { getToken, getOrgId, getRefreshToken, setToken, logout } from "../utils/authStore";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Endpoints that do not require authentication headers
const PUBLIC_ENDPOINTS = [
  "/auth/login/", 
  "/auth/register/", 
  "/auth/refresh/", 
  "/auth/logout/",
  "/organizations/invitations/validate/"
];

/*
REQUEST INTERCEPTOR
Attach access token + organization id
*/
api.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint));
    const token = getToken();
    const orgId = getOrgId();

    if (!isPublic) {
      // Prevent unauthenticated API requests client-side
      if (!token || !orgId) {
        return Promise.reject(new axios.Cancel("Missing authentication or organization context. Request cancelled."));
      }
    }

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
Auto refresh access token when 401 occurs, with queueing and loop-prevention
*/
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // Ignore manually cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isPublic = PUBLIC_ENDPOINTS.some((endpoint) => originalRequest.url?.includes(endpoint));
      if (isPublic) {
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use bare axios to avoid interceptor recursion and specify baseURL manually
        const response = await axios.post(`${baseURL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // save new access token in memory
        setToken(newAccessToken);

        // retry queued requests
        processQueue(null, newAccessToken);

        // update original request header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      // Step 6: API Error Handling for RBAC
      alert("You do not have permission to perform this action.");
    }

    return Promise.reject(error);
  }
);

export default api;