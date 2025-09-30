import React, { createContext, useContext, useState, useEffect } from "react";

// Create Admin Context
const AdminContext = createContext();

// Sample products data
const initialProducts = [
  {
    id: "1",
    name: "Tray Table",
    category: "Furniture",
    price: 199.0,
    stock: 25,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&auto=format",
    description: "Modern minimalist tray table perfect for any living space",
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    name: "Table Lamp",
    category: "Lighting",
    price: 89.0,
    stock: 15,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format",
    description: "Elegant table lamp with warm ambient lighting",
    createdAt: "2023-10-12",
  },
  {
    id: "3",
    name: "Ceramic Vase",
    category: "Decor",
    price: 45.0,
    stock: 8,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format",
    description: "Handcrafted ceramic vase for modern home decoration",
    createdAt: "2023-10-10",
  },
  {
    id: "4",
    name: "Floor Cushion",
    category: "Furniture",
    price: 65.0,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop&auto=format",
    description: "Comfortable floor cushion for relaxed seating",
    createdAt: "2023-10-08",
  },
];

// Sample orders data
const initialOrders = [
  {
    id: "34561",
    displayId: "#3456.768",
    customerName: "Sofia Havertz",
    customerEmail: "sofia.havertz@example.com",
    date: "2023-10-17",
    status: "Delivered",
    total: 1234.0,
    items: [
      { name: "Tray Table", quantity: 2, price: 199.0 },
      { name: "Table Lamp", quantity: 1, price: 836.0 },
    ],
    shippingAddress: "345 Long Island, New York, United States",
  },
  {
    id: "34562",
    displayId: "#3456.980",
    customerName: "John Smith",
    customerEmail: "john.smith@example.com",
    date: "2023-10-16",
    status: "Processing",
    total: 345.0,
    items: [{ name: "Ceramic Vase", quantity: 1, price: 345.0 }],
    shippingAddress: "123 Main St, Los Angeles, CA, United States",
  },
  {
    id: "34563",
    displayId: "#3456.120",
    customerName: "Emma Wilson",
    customerEmail: "emma.wilson@example.com",
    date: "2023-10-15",
    status: "Shipped",
    total: 2345.0,
    items: [{ name: "Dining Set", quantity: 1, price: 2345.0 }],
    shippingAddress: "789 Oak Ave, Chicago, IL, United States",
  },
  {
    id: "34564",
    displayId: "#3456.030",
    customerName: "Michael Johnson",
    customerEmail: "michael.j@example.com",
    date: "2023-10-14",
    status: "Pending",
    total: 845.0,
    items: [
      { name: "Floor Lamp", quantity: 1, price: 445.0 },
      { name: "Side Table", quantity: 1, price: 400.0 },
    ],
    shippingAddress: "456 Pine St, Miami, FL, United States",
  },
];

// Admin Provider Component
export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts");
    const savedOrders = localStorage.getItem("adminOrders");

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Check if orders have the old format and update them
        const updatedOrders = parsedOrders.map((order) => {
          if (order.id.includes("#") || order.id.includes(".")) {
            // Convert old format to new format
            const cleanId = order.id.replace("#", "").replace(".", "");
            return {
              ...order,
              id: cleanId,
              displayId: order.id, // Keep the old ID as displayId
            };
          }
          return order;
        });
        setOrders(updatedOrders);
        // Save the updated format back to localStorage
        localStorage.setItem("adminOrders", JSON.stringify(updatedOrders));
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("adminProducts", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("adminOrders", JSON.stringify(orders));
  }, [orders]);

  // Product management functions
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  // Order management functions
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  // Statistics calculations
  const getStats = () => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const lowStockProducts = products.filter(
      (product) => product.stock <= 5
    ).length;

    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      ordersByStatus,
    };
  };

  // Reset all data to initial state (useful for clearing old cached data)
  const resetData = () => {
    localStorage.removeItem("adminProducts");
    localStorage.removeItem("adminOrders");
    setProducts(initialProducts);
    setOrders(initialOrders);
  };

  const contextValue = {
    // Data
    products,
    orders,

    // Product functions
    addProduct,
    updateProduct,
    deleteProduct,

    // Order functions
    updateOrderStatus,
    deleteOrder,

    // Statistics
    getStats,
    // Utility
    resetData,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
};

export default AdminContext;
