import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // optional: 10s timeout
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Process failed requests queue
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

// Manual refresh token function
const refreshToken = async () => {
  try {
    console.log("🔄 Attempting manual token refresh...");

    // Get refresh token from localStorage
    const authData = localStorage.getItem("_auth");
    let refreshTokenValue = null;

    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        refreshTokenValue = parsedAuth.refreshToken;
      } catch (error) {
        console.error("Error parsing auth data for refresh:", error);
      }
    }

    // Fallback to direct storage
    if (!refreshTokenValue) {
      refreshTokenValue = localStorage.getItem("refresh_token");
    }

    if (!refreshTokenValue) {
      throw new Error("No refresh token available");
    }

    // Make refresh request
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/auth/refresh/",
      {
        refresh: refreshTokenValue,
      }
    );

    console.log("📦 Refresh token response:", response.data);

    // Update tokens in localStorage
    const newAccessToken =
      response.data?.tokens?.access ||
      response.data?.access ||
      response.data?.access_token;
    const newRefreshToken =
      response.data?.tokens?.refresh ||
      response.data?.refresh ||
      response.data?.refresh_token;

    if (newAccessToken) {
      // Update react-auth-kit storage
      if (authData) {
        try {
          const parsedAuth = JSON.parse(authData);
          parsedAuth.token = newAccessToken;
          if (newRefreshToken) {
            parsedAuth.refreshToken = newRefreshToken;
          }
          localStorage.setItem("_auth", JSON.stringify(parsedAuth));
        } catch (error) {
          console.error("Error updating react-auth-kit storage:", error);
        }
      }

      // Also update direct storage as fallback
      localStorage.setItem("token", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }

      console.log("✅ Tokens updated successfully");
      return newAccessToken;
    } else {
      throw new Error("No access token in refresh response");
    }
  } catch (error) {
    console.error("❌ Token refresh failed:", error);

    // Clear all auth data on refresh failure
    localStorage.removeItem("_auth");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/signin";

    throw error;
  }
};

// Example: request interceptor (optional)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (react-auth-kit stores it in localStorage)
    const authData = localStorage.getItem("_auth");
    if (authData) {
      try {
        // Check if authData is a JWT token (starts with "eyJ")
        if (authData.startsWith("eyJ")) {
          // It's a JWT token, use it directly
          config.headers.Authorization = `Bearer ${authData}`;
        } else {
          // It's JSON, parse it
          const parsedAuth = JSON.parse(authData);
          const token = parsedAuth.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        // Fallback: try to get token from direct localStorage storage
        const directToken = localStorage.getItem("token");
        if (directToken) {
          config.headers.Authorization = `Bearer ${directToken}`;
        }
      }
    } else {
      // Fallback: try to get token from direct localStorage storage
      const directToken = localStorage.getItem("token");
      if (directToken) {
        config.headers.Authorization = `Bearer ${directToken}`;
      }
    }

    // Handle FormData - don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors with automatic token refresh
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
        const newToken = await refreshToken();
        processQueue(null, newToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
