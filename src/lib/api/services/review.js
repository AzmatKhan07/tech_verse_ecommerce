import apiClient from "../api";

class ReviewService {
  constructor() {
    this.baseURL = "/v1/products";
  }

  // Get reviews for a specific product
  async getProductReviews(productId, params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.page_size) queryParams.append("page_size", params.page_size);
      if (params.rating) queryParams.append("rating", params.rating);
      if (params.status !== undefined)
        queryParams.append("status", params.status);

      const url = `${this.baseURL}/reviews/${
        productId ? `?product=${productId}` : ""
      }${queryParams.toString() ? `&${queryParams.toString()}` : ""}`;

      console.log("🔍 Fetching product reviews from:", url);
      const response = await apiClient.get(url);
      console.log("✅ Product reviews fetched successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching product reviews:", error);
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

  // Create a new review
  async createReview(reviewData) {
    try {
      console.log("📝 Creating review:", reviewData);
      const response = await apiClient.post(
        `${this.baseURL}/reviews/`,
        reviewData
      );
      console.log("✅ Review created successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating review:", error);
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

  // Update a review
  async updateReview(reviewId, reviewData) {
    try {
      console.log("📝 Updating review:", reviewId, reviewData);
      const response = await apiClient.put(
        `${this.baseURL}/reviews/${reviewId}/`,
        reviewData
      );
      console.log("✅ Review updated successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating review:", error);
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

  // Delete a review
  async deleteReview(reviewId) {
    try {
      console.log("🗑️ Deleting review:", reviewId);
      const response = await apiClient.delete(
        `${this.baseURL}/reviews/${reviewId}/`
      );
      console.log("✅ Review deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting review:", error);
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

export default new ReviewService();
