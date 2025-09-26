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

// Track ongoing refresh attempts to prevent multiple simultaneous requests
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
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Attempting to refresh token...");

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          console.error("❌ No refresh token available");
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/v1/auth/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout for refresh
          }
        );

        console.log("✅ Token refreshed successfully");

        // Update tokens in localStorage
        if (response.data?.access) {
          localStorage.setItem("token", response.data.access);
          // Update refresh token if provided (some APIs return new refresh token)
          if (response.data.refresh) {
            localStorage.setItem("refresh_token", response.data.refresh);
          }
        } else {
          console.error("❌ No access token in refresh response");
          throw new Error("Invalid refresh response");
        }

        // Update the original request with new token
        const newToken = localStorage.getItem("token");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process queued requests
        processQueue(null, newToken);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
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
