import apiClient from "../api";

class SizeService {
  constructor() {
    this.baseURL = "/v1/core/sizes/";
  }

  // Get all sizes with pagination, search, and ordering
  async getSizes(params = {}) {
    try {
      console.log("🔗 Fetching sizes with params:", params);
      const response = await apiClient.get(this.baseURL, { params });
      console.log("📦 Sizes fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching sizes:", error);
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

  // Get single size by ID
  async getSize(id) {
    try {
      console.log("🔗 Fetching size by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.get(`${this.baseURL}${id}/`);
      console.log("📦 Size fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching size:", error);
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

  // Create new size
  async createSize(sizeData) {
    try {
      console.log("🔗 Creating size:", sizeData);

      const jsonData = {
        size: sizeData.size,
        status: sizeData.status,
      };

      const response = await apiClient.post(this.baseURL, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Size created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating size:", error);
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

  // Update size (PUT - full update)
  async updateSize(id, sizeData) {
    try {
      console.log("🔗 Updating size by ID:", `${this.baseURL}${id}/`);

      const jsonData = {
        size: sizeData.size,
        status: sizeData.status,
      };

      const response = await apiClient.put(`${this.baseURL}${id}/`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Size updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating size:", error);
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

  // Patch size (PATCH - partial update)
  async patchSize(id, sizeData) {
    try {
      console.log("🔗 Patching size by ID:", `${this.baseURL}${id}/`);

      const jsonData = {};

      if (sizeData.size !== undefined) {
        jsonData.size = sizeData.size;
      }
      if (sizeData.status !== undefined) {
        jsonData.status = sizeData.status;
      }

      const response = await apiClient.patch(
        `${this.baseURL}${id}/`,
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📦 Size patched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error patching size:", error);
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

  // Delete size
  async deleteSize(id) {
    try {
      console.log("🔗 Deleting size by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.delete(`${this.baseURL}${id}/`);
      console.log("📦 Size deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting size:", error);
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

  // Search sizes
  async searchSizes(searchTerm, params = {}) {
    try {
      console.log("🔗 Searching sizes:", searchTerm);
      const searchParams = { ...params, search: searchTerm };
      const response = await apiClient.get(this.baseURL, {
        params: searchParams,
      });
      console.log("📦 Size search results:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error searching sizes:", error);
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

  // Get active sizes only
  async getActiveSizes(params = {}) {
    try {
      console.log("🔗 Fetching active sizes");
      const activeParams = { ...params, status: true };
      const response = await apiClient.get(this.baseURL, {
        params: activeParams,
      });
      console.log("📦 Active sizes fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching active sizes:", error);
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

export const sizeService = new SizeService();
