import apiClient from "../api";

class OrdersService {
  constructor() {
    this.baseURL = "/v1/orders";
  }

  // Get current user's orders
  async getMyOrders() {
    try {
      console.log("📦 Fetching user orders...");
      const response = await apiClient.get(`${this.baseURL}/orders/my-orders/`);
      console.log("✅ Orders fetched successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(
          `API Error: ${error.response.status} - ${
            error.response.data?.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        throw new Error("Network Error: Unable to connect to the server");
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }

  // Get all orders (admin) with filtering and pagination
  async getAllOrders(params = {}) {
    try {
      console.log("📦 Fetching all orders with params:", params);
      const response = await apiClient.get(`${this.baseURL}/orders/`, {
        params,
      });
      console.log("✅ Orders fetched successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(
          `API Error: ${error.response.status} - ${
            error.response.data?.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        throw new Error("Network Error: Unable to connect to the server");
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }

  // Get order details by ID
  async getOrderById(orderId) {
    try {
      console.log("📦 Fetching order details:", orderId);
      const response = await apiClient.get(
        `${this.baseURL}/orders/${orderId}/`
      );
      console.log("✅ Order details fetched successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching order details:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(
          `API Error: ${error.response.status} - ${
            error.response.data?.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        throw new Error("Network Error: Unable to connect to the server");
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }

  // Update order status using the specific update_status endpoint
  async updateOrderStatus(orderId, statusData) {
    try {
      console.log("📦 Updating order status:", orderId, statusData);
      const response = await apiClient.patch(
        `${this.baseURL}/orders/${orderId}/update_status/`,
        statusData
      );
      console.log("✅ Order status updated successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(
          `API Error: ${error.response.status} - ${
            error.response.data?.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        throw new Error("Network Error: Unable to connect to the server");
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }
}

const ordersService = new OrdersService();
export default ordersService;
