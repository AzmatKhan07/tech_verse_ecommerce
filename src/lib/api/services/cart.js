import apiClient from "../api";

/**
 * CartService - Handles all cart-related API operations
 */
class CartService {
  constructor() {
    this.baseURL = "/v1/orders";
  }

  // Add item to cart
  async addToCart(cartData) {
    try {
      console.log("🛒 Adding item to cart:", cartData);
      const response = await apiClient.post(
        `${this.baseURL}/cart/add-item/`,
        cartData
      );
      console.log("✅ Item added to cart successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding item to cart:", error);
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

  // Get cart items for a specific user
  async getCartItems(userId) {
    try {
      console.log("🛒 Fetching cart items for user:", userId);
      const response = await apiClient.get(
        `${this.baseURL}/cart/?user_id=${userId}`
      );
      console.log("✅ Cart items fetched successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching cart items:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        // Return empty array for 404 instead of throwing error
        if (error.response.status === 404) {
          console.log("🔄 Cart not found, returning empty cart");
          return [];
        }
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

  // Update cart item quantity
  async updateCartItem(cartItemId, cartData) {
    try {
      console.log("🛒 Updating cart item:", cartItemId, cartData);
      const response = await apiClient.post(
        `${this.baseURL}/cart/update-quantity/`,
        cartData
      );
      console.log("✅ Cart item updated successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating cart item:", error);
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

  // Delete cart item
  async deleteCartItem(cartItemId) {
    try {
      console.log("🛒 Deleting cart item:", cartItemId);
      const response = await apiClient.delete(
        `${this.baseURL}/cart/${cartItemId}/remove-item/`
      );
      console.log("✅ Cart item deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting cart item:", error);
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

  // Clear entire cart
  async clearCart() {
    try {
      console.log("🛒 Clearing cart");
      const response = await apiClient.delete(`${this.baseURL}/cart/clear/`);
      console.log("✅ Cart cleared successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
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

// Create and export a singleton instance
const cartService = new CartService();
export default cartService;
