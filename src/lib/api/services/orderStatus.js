import apiClient from "../api.js";

class OrderStatusService {
  constructor() {
    this.baseURL = "/v1/core/order-status";
  }

  // Get all order statuses with optional filtering and pagination
  async getOrderStatuses(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add all supported parameters from the API
      if (params.ordering) queryParams.append("ordering", params.ordering);
      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      if (params.page_size) queryParams.append("page_size", params.page_size);

      const url = `${this.baseURL}/${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      console.log("🔗 Fetching order statuses from:", url);

      const response = await apiClient.get(url);
      console.log("📦 API Response:", response.data);

      // Transform the API response to match our expected format
      const transformedData = {
        orderStatuses: response.data.results || response.data,
        pagination: {
          count: response.data.count || 0,
          totalPages: Math.ceil(
            (response.data.count || 0) / (params.page_size || 20)
          ),
          currentPage: params.page || 1,
          hasNext: !!response.data.next,
          hasPrevious: !!response.data.previous,
        },
      };

      return transformedData;
    } catch (error) {
      console.error("❌ Error fetching order statuses:", error);

      // Provide more detailed error information
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

  // Get a single order status by ID
  async getOrderStatus(id) {
    try {
      const response = await apiClient.get(`${this.baseURL}/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order status:", error);
      throw error;
    }
  }

  // Create a new order status
  async createOrderStatus(orderStatusData) {
    try {
      console.log("🔗 Creating order status...");
      console.log("📦 Order status data:", orderStatusData);

      const response = await apiClient.post(
        `${this.baseURL}/`,
        orderStatusData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error creating order status:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  }

  // Update an existing order status
  async updateOrderStatus(id, orderStatusData) {
    try {
      const response = await apiClient.put(
        `${this.baseURL}/${id}/`,
        orderStatusData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // Partially update an order status
  async patchOrderStatus(id, orderStatusData) {
    try {
      const response = await apiClient.patch(
        `${this.baseURL}/${id}/`,
        orderStatusData
      );
      return response.data;
    } catch (error) {
      console.error("Error patching order status:", error);
      throw error;
    }
  }

  // Delete an order status
  async deleteOrderStatus(id) {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order status:", error);
      throw error;
    }
  }

  // Get order statuses with search functionality
  async searchOrderStatuses(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return this.getOrderStatuses(params);
  }
}

// Create and export a singleton instance
const orderStatusService = new OrderStatusService();
export default orderStatusService;
