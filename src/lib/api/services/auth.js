import apiClient from "../api.js";

class AuthService {
  constructor() {
    this.baseURL = "/v1/auth";
  }

  // Login user
  async login(credentials) {
    try {
      console.log("🔗 Attempting login with:", { email: credentials.email });

      const response = await apiClient.post(`${this.baseURL}/login/`, {
        email: credentials.email,
        password: credentials.password,
      });

      console.log("📦 Login API Response:", response.data);

      // Note: Tokens are now handled by react-auth-kit, no need to store them manually
      console.log(
        "✅ Login successful, tokens will be handled by react-auth-kit"
      );

      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);

      // Provide more detailed error information
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        // Handle specific error cases
        if (error.response.status === 401) {
          throw new Error("Invalid email or password");
        } else if (error.response.status === 400) {
          const errorMessage =
            error.response.data?.detail ||
            error.response.data?.message ||
            "Invalid request data";
          throw new Error(errorMessage);
        } else if (error.response.status === 422) {
          const errorMessage =
            error.response.data?.detail || "Validation error";
          throw new Error(errorMessage);
        } else {
          throw new Error(
            `Login failed: ${error.response.status} - ${
              error.response.data?.detail || "Unknown error"
            }`
          );
        }
      } else if (error.request) {
        console.error("Request error:", error.request);
        throw new Error("Network Error: Unable to connect to the server");
      } else {
        throw new Error(`Login Error: ${error.message}`);
      }
    }
  }

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Call logout endpoint if available
        await apiClient.post(
          `${this.baseURL}/logout/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      // Always remove tokens from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      console.log("✅ All tokens and user data removed from localStorage");
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiClient.get(`${this.baseURL}/me/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      // Get refresh token from react-auth-kit storage
      const authData = localStorage.getItem("_auth");
      let refreshToken = null;

      if (authData) {
        try {
          const parsedAuth = JSON.parse(authData);
          refreshToken = parsedAuth.refreshToken;
        } catch (error) {
          console.error("Error parsing auth data for refresh:", error);
        }
      }

      // Fallback to direct storage
      if (!refreshToken) {
        refreshToken = localStorage.getItem("refresh_token");
      }

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      console.log("🔄 Manual token refresh requested");

      const response = await apiClient.post(`${this.baseURL}/refresh/`, {
        refresh: refreshToken,
      });

      console.log("📦 Refresh token response:", response.data);

      // Return the response data - react-auth-kit will handle token storage
      return response.data;
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      // Clear tokens on refresh failure
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem("token");
  }

  // Check if token is expired (basic JWT check)
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decode JWT token (basic check without verification)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Check if token is expired (with 5 minute buffer)
      return payload.exp < currentTime + 300;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // Assume expired if we can't decode
    }
  }

  // Proactively refresh token if it's close to expiring
  async refreshTokenIfNeeded() {
    if (this.isTokenExpired()) {
      console.log("🔄 Token is expired or close to expiring, refreshing...");
      try {
        await this.refreshToken();
        return true;
      } catch (error) {
        console.error("❌ Failed to refresh token:", error);
        return false;
      }
    }
    return true;
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
