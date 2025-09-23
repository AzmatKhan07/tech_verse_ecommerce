// Debug utility for testing authentication
import authService from "./services/auth";

export const testLogin = async (
  email = "test@example.com",
  password = "testpass"
) => {
  console.log("🔐 Testing Login API...");

  try {
    console.log("📧 Attempting login with:", { email });

    const response = await authService.login({ email, password });
    console.log("✅ Login successful:", response);

    return {
      success: true,
      message: "Login test completed successfully!",
      data: response,
    };
  } catch (error) {
    console.error("❌ Login test failed:", error);
    return {
      success: false,
      message: "Login test failed",
      error: error.message,
    };
  }
};

export const testLogout = async () => {
  console.log("🚪 Testing Logout API...");

  try {
    await authService.logout();
    console.log("✅ Logout successful");

    return {
      success: true,
      message: "Logout test completed successfully!",
    };
  } catch (error) {
    console.error("❌ Logout test failed:", error);
    return {
      success: false,
      message: "Logout test failed",
      error: error.message,
    };
  }
};

export const testCurrentUser = async () => {
  console.log("👤 Testing Get Current User API...");

  try {
    const user = await authService.getCurrentUser();
    console.log("✅ Get current user successful:", user);

    return {
      success: true,
      message: "Get current user test completed successfully!",
      data: user,
    };
  } catch (error) {
    console.error("❌ Get current user test failed:", error);
    return {
      success: false,
      message: "Get current user test failed",
      error: error.message,
    };
  }
};

export const testAuthStatus = () => {
  console.log("🔍 Testing Authentication Status...");

  const isAuthenticated = authService.isAuthenticated();
  const token = authService.getToken();
  const refreshToken = localStorage.getItem("refresh_token");
  const isExpired = authService.isTokenExpired();

  console.log("🔐 Is authenticated:", isAuthenticated);
  console.log("🎫 Access token exists:", !!token);
  console.log("🔄 Refresh token exists:", !!refreshToken);
  console.log("⏰ Token is expired:", isExpired);
  console.log(
    "🎫 Token preview:",
    token ? `${token.substring(0, 20)}...` : "No token"
  );

  return {
    success: true,
    message: "Authentication status check completed!",
    data: {
      isAuthenticated,
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      isExpired,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
    },
  };
};

export const testRefreshToken = async () => {
  console.log("🔄 Testing Manual Token Refresh...");

  try {
    const result = await authService.refreshToken();
    console.log("✅ Manual token refresh successful:", result);

    return {
      success: true,
      message: "Manual token refresh completed successfully!",
      data: result,
    };
  } catch (error) {
    console.error("❌ Manual token refresh failed:", error);
    return {
      success: false,
      message: "Manual token refresh failed",
      error: error.message,
    };
  }
};

export const testProactiveRefresh = async () => {
  console.log("🔮 Testing Proactive Token Refresh...");

  try {
    const result = await authService.refreshTokenIfNeeded();
    console.log("✅ Proactive refresh result:", result);

    return {
      success: true,
      message: "Proactive token refresh check completed!",
      data: { refreshed: result },
    };
  } catch (error) {
    console.error("❌ Proactive refresh failed:", error);
    return {
      success: false,
      message: "Proactive refresh failed",
      error: error.message,
    };
  }
};

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testLogin = testLogin;
  window.testLogout = testLogout;
  window.testCurrentUser = testCurrentUser;
  window.testAuthStatus = testAuthStatus;
  window.testRefreshToken = testRefreshToken;
  window.testProactiveRefresh = testProactiveRefresh;
}
