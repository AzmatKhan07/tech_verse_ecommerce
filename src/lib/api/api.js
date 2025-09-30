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
    // Add auth token if available (react-auth-kit stores it in localStorage)
    const authData = localStorage.getItem("_auth");
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        const token = parsedAuth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
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
  (error) => {
    // Handle 401 errors - react-auth-kit will handle token refresh automatically
    if (error.response && error.response.status === 401) {
      console.error("❌ Unauthorized access - token may be invalid");
      // React Auth Kit will automatically handle token refresh
    }

    // Handle other errors
    if (error.response && error.response.status === 403) {
      console.error("❌ Forbidden access");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
