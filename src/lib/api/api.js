import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // optional: 10s timeout
});

// Example: request interceptor (optional)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData - don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors with token refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Attempting to refresh token...");

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          console.error("❌ No refresh token available");
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/v1/auth/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Token refreshed successfully");

        // Update tokens in localStorage
        if (response.data?.access) {
          localStorage.setItem("token", response.data.access);
          if (response.data.refresh) {
            localStorage.setItem("refresh_token", response.data.refresh);
          }
        } else if (response.data?.access) {
          // Handle different response format
          localStorage.setItem("token", response.data.access);
          if (response.data.refresh) {
            localStorage.setItem("refresh_token", response.data.refresh);
          }
        }

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
          "token"
        )}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        // Clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        // Redirect to login page
        if (window.location.pathname !== "/signin") {
          localStorage.setItem("intendedPath", window.location.pathname);
          window.location.href = "/signin";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response && error.response.status === 403) {
      console.error("❌ Forbidden access");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
