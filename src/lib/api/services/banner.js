import apiClient from "../api.js";

class BannerService {
  constructor() {
    this.baseURL = "/v1/core/banners";
  }

  // Get all banners with optional filtering and pagination
  async getBanners(params = {}) {
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
      console.log("🔗 Fetching banners from:", url);

      const response = await apiClient.get(url);
      console.log("📦 API Response:", response.data);

      // Transform the API response to match our expected format
      const transformedData = {
        banners: response.data.results || response.data,
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
      console.error("❌ Error fetching banners:", error);

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

  // Get a single banner by ID
  async getBanner(id) {
    try {
      const response = await apiClient.get(`${this.baseURL}/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching banner:", error);
      throw error;
    }
  }

  // Create a new banner
  async createBanner(bannerData) {
    try {
      console.log("🔗 Creating banner...");
      console.log(
        "📦 Banner data type:",
        bannerData instanceof FormData ? "FormData" : "JSON"
      );

      const response = await apiClient.post(`${this.baseURL}/`, bannerData);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating banner:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  }

  // Update an existing banner
  async updateBanner(id, bannerData) {
    try {
      const response = await apiClient.put(
        `${this.baseURL}/${id}/`,
        bannerData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  }

  // Partially update a banner
  async patchBanner(id, bannerData) {
    try {
      const response = await apiClient.patch(
        `${this.baseURL}/${id}/`,
        bannerData
      );
      return response.data;
    } catch (error) {
      console.error("Error patching banner:", error);
      throw error;
    }
  }

  // Delete a banner
  async deleteBanner(id) {
    try {
      const response = await apiClient.delete(`${this.baseURL}/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  }

  // Get banners with search functionality
  async searchBanners(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return this.getBanners(params);
  }

  // Get active banners
  async getActiveBanners() {
    return this.getBanners({ status: true });
  }
}

// Create and export a singleton instance
const bannerService = new BannerService();
export default bannerService;
