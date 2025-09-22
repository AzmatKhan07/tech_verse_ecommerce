import React, { createContext, useContext, useState, useEffect } from "react";

// Create User Context
const UserContext = createContext();

// Initial user state
const initialUserState = {
  firstName: "Sofia",
  lastName: "Havertz",
  displayName: "Sofia Havertz",
  email: "sofia.havertz@example.com",
  avatar:
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&auto=format",
  isLoggedIn: true,
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

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({ ...initialUserState, ...userData });
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
      }
    }
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
  const logout = () => {
    setUser({
      ...initialUserState,
      isLoggedIn: false,
    });
    localStorage.removeItem("user");
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
