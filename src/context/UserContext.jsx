import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "@/lib/api/services/auth";

// Create User Context
const UserContext = createContext();

// Initial user state
const initialUserState = {
  firstName: "",
  lastName: "",
  displayName: "",
  email: "",
  avatar: "",
  isLoggedIn: false,
  addresses: {
    billing: {
      id: "billing-1",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, New York, United States",
      isDefault: true,
    },
    shipping: {
      id: "shipping-1",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, New York, United States",
      isDefault: true,
    },
  },
  orders: [
    {
      id: "34561",
      displayId: "#3456.768",
      date: "October 17, 2023",
      status: "Delivered",
      price: 1234.0,
      items: [
        { name: "Tray Table", quantity: 2, price: 199.0 },
        { name: "Table Lamp", quantity: 1, price: 836.0 },
      ],
    },
    {
      id: "34562",
      displayId: "#3456.980",
      date: "October 11, 2023",
      status: "Delivered",
      price: 345.0,
      items: [{ name: "Ceramic Vase", quantity: 1, price: 345.0 }],
    },
    {
      id: "34563",
      displayId: "#3456.120",
      date: "August 24, 2023",
      status: "Delivered",
      price: 2345.0,
      items: [{ name: "Dining Set", quantity: 1, price: 2345.0 }],
    },
    {
      id: "34564",
      displayId: "#3456.030",
      date: "August 12, 2023",
      status: "Delivered",
      price: 845.0,
      items: [
        { name: "Floor Lamp", quantity: 1, price: 445.0 },
        { name: "Side Table", quantity: 1, price: 400.0 },
      ],
    },
  ],
};

// User Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserState);

  // Load user data from localStorage on mount and check authentication
  useEffect(() => {
    const initializeUser = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && token && authService.isAuthenticated()) {
        try {
          const userData = JSON.parse(savedUser);
          setUser({ ...initialUserState, ...userData, isLoggedIn: true });

          // Optionally verify token with server
          try {
            const currentUser = await authService.getCurrentUser();
            setUser((prev) => ({ ...prev, ...currentUser, isLoggedIn: true }));
          } catch (error) {
            console.error("Token verification failed:", error);
            // Don't logout automatically, just set user as not logged in
            setUser({ ...initialUserState, isLoggedIn: false });
          }
        } catch (error) {
          console.error("Error loading user from localStorage:", error);
          // Don't logout automatically, just set user as not logged in
          setUser({ ...initialUserState, isLoggedIn: false });
        }
      } else {
        // No valid session, ensure user is logged out
        setUser({ ...initialUserState, isLoggedIn: false });
      }
    };

    initializeUser();
  }, []);

  // Save user data to localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // Update user profile
  const updateProfile = (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  };

  // Update password (in real app, this would make API call)
  const updatePassword = (oldPassword, newPassword) => {
    // In a real app, you would validate the old password and update via API
    console.log("Password updated successfully");
    return Promise.resolve({ success: true });
  };

  // Login user
  const login = (userData) => {
    setUser({
      ...userData,
      isLoggedIn: true,
    });
  };

  // Logout user
  const logout = async () => {
    try {
      // Call logout API
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state
      setUser({
        ...initialUserState,
        isLoggedIn: false,
      });
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
    }
  };

  // Update address
  const updateAddress = (type, addressData) => {
    setUser((prevUser) => ({
      ...prevUser,
      addresses: {
        ...prevUser.addresses,
        [type]: {
          ...prevUser.addresses?.[type],
          ...addressData,
        },
      },
    }));
  };

  // Add new address
  const addAddress = (type, addressData) => {
    const newAddress = {
      id: `${type}-${Date.now()}`,
      ...addressData,
      isDefault: !user.addresses?.[type],
    };

    setUser((prevUser) => ({
      ...prevUser,
      addresses: {
        ...prevUser.addresses,
        [type]: newAddress,
      },
    }));
  };

  const contextValue = {
    user,
    updateProfile,
    updatePassword,
    updateAddress,
    addAddress,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export default UserContext;
