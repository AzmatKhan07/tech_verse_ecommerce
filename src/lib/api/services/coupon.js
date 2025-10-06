import apiClient from "../api";

class CouponService {
  constructor() {
    this.baseURL = "/v1/core/coupons/";
  }

  // Get all coupons with pagination, search, and ordering
  async getCoupons(params = {}) {
    try {
      console.log("🔗 Fetching coupons with params:", params);
      const response = await apiClient.get(this.baseURL, { params });
      console.log("📦 Coupons fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching coupons:", error);
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

  // Get single coupon by ID
  async getCoupon(id) {
    try {
      console.log("🔗 Fetching coupon by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.get(`${this.baseURL}${id}/`);
      console.log("📦 Coupon fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching coupon:", error);
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

  // Create new coupon
  async createCoupon(couponData) {
    try {
      console.log("🔗 Creating coupon:", couponData);
      const response = await apiClient.post(this.baseURL, couponData);
      console.log("📦 Coupon created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating coupon:", error);
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

  // Update coupon (PUT - full update)
  async updateCoupon(id, couponData) {
    try {
      console.log("🔗 Updating coupon by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.put(`${this.baseURL}${id}/`, couponData);
      console.log("📦 Coupon updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating coupon:", error);
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

  // Patch coupon (PATCH - partial update)
  async patchCoupon(id, couponData) {
    try {
      console.log("🔗 Patching coupon by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.patch(
        `${this.baseURL}${id}/`,
        couponData
      );
      console.log("📦 Coupon patched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error patching coupon:", error);
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

  // Delete coupon
  async deleteCoupon(id) {
    try {
      console.log("🔗 Deleting coupon by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.delete(`${this.baseURL}${id}/`);
      console.log("📦 Coupon deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting coupon:", error);
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

  // Search coupons
  async searchCoupons(searchTerm, params = {}) {
    try {
      console.log("🔗 Searching coupons:", searchTerm);
      const searchParams = { ...params, search: searchTerm };
      const response = await apiClient.get(this.baseURL, {
        params: searchParams,
      });
      console.log("📦 Coupon search results:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error searching coupons:", error);
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

  // Get active coupons only
  async getActiveCoupons(params = {}) {
    try {
      console.log("🔗 Fetching active coupons");
      const activeParams = { ...params, status: true };
      const response = await apiClient.get(this.baseURL, {
        params: activeParams,
      });
      console.log("📦 Active coupons fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching active coupons:", error);
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

  // Validate coupon
  async validateCoupon(code, orderAmount = 0) {
    try {
      console.log("🔗 Validating coupon:", code);
      console.log("🔗 API URL:", `${this.baseURL}validate-coupon/`);
      console.log("🔗 Request data:", { code, order_amount: orderAmount });

      // Check authentication
      const authData = localStorage.getItem("_auth");
      console.log("🔗 Auth data:", authData ? "Present" : "Missing");

      const response = await apiClient.post(`${this.baseURL}validate-coupon/`, {
        code,
        order_amount: orderAmount,
      });
      console.log("📦 Coupon validation result:", response.data);

      // If validation fails, throw an error with the message
      if (!response.data.valid) {
        throw new Error(response.data.message || "Invalid coupon");
      }

      return response.data;
    } catch (error) {
      console.error("❌ Error validating coupon:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        // Handle authentication errors
        if (error.response.status === 401) {
          throw new Error("Please log in to apply coupons");
        }

        // If it's a validation error, throw the specific message
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }

        // Handle other API errors
        if (error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
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
}

export const couponService = new CouponService();
