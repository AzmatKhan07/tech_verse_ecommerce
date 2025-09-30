import apiClient from "../api";

class ColorService {
  constructor() {
    this.baseURL = "/v1/core/colors/";
  }

  // Get all colors with pagination, search, and ordering
  async getColors(params = {}) {
    try {
      console.log("🔗 Fetching colors with params:", params);
      const response = await apiClient.get(this.baseURL, { params });
      console.log("📦 Colors fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching colors:", error);
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

  // Get single color by ID
  async getColor(id) {
    try {
      console.log("🔗 Fetching color by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.get(`${this.baseURL}${id}/`);
      console.log("📦 Color fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching color:", error);
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

  // Create new color
  async createColor(colorData) {
    try {
      console.log("🔗 Creating color:", colorData);

      const jsonData = {
        color: colorData.color,
        status: colorData.status,
      };

      const response = await apiClient.post(this.baseURL, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Color created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating color:", error);
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

  // Update color (PUT - full update)
  async updateColor(id, colorData) {
    try {
      console.log("🔗 Updating color by ID:", `${this.baseURL}${id}/`);

      const jsonData = {
        color: colorData.color,
        status: colorData.status,
      };

      const response = await apiClient.put(`${this.baseURL}${id}/`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Color updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating color:", error);
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

  // Patch color (PATCH - partial update)
  async patchColor(id, colorData) {
    try {
      console.log("🔗 Patching color by ID:", `${this.baseURL}${id}/`);

      const jsonData = {};

      if (colorData.color !== undefined) {
        jsonData.color = colorData.color;
      }
      if (colorData.status !== undefined) {
        jsonData.status = colorData.status;
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

      console.log("📦 Color patched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error patching color:", error);
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

  // Delete color
  async deleteColor(id) {
    try {
      console.log("🔗 Deleting color by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.delete(`${this.baseURL}${id}/`);
      console.log("📦 Color deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting color:", error);
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

  // Search colors
  async searchColors(searchTerm, params = {}) {
    try {
      console.log("🔗 Searching colors:", searchTerm);
      const searchParams = { ...params, search: searchTerm };
      const response = await apiClient.get(this.baseURL, {
        params: searchParams,
      });
      console.log("📦 Color search results:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error searching colors:", error);
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

  // Get active colors only
  async getActiveColors(params = {}) {
    try {
      console.log("🔗 Fetching active colors");
      const activeParams = { ...params, status: true };
      const response = await apiClient.get(this.baseURL, {
        params: activeParams,
      });
      console.log("📦 Active colors fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching active colors:", error);
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

export const colorService = new ColorService();
