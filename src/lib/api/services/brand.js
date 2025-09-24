import apiClient from "../api";

class BrandService {
  constructor() {
    this.baseURL = "/v1/core/brands/";
  }

  // Get all brands with pagination, search, and ordering
  async getBrands(params = {}) {
    try {
      console.log("🔗 Fetching brands with params:", params);
      const response = await apiClient.get(this.baseURL, { params });
      console.log("📦 Brands fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching brands:", error);
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

  // Get single brand by ID
  async getBrand(id) {
    try {
      console.log("🔗 Fetching brand by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.get(`${this.baseURL}${id}/`);
      console.log("📦 Brand fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching brand:", error);
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

  // Create new brand
  async createBrand(brandData) {
    try {
      console.log("🔗 Creating brand:", brandData);

      // Check if we have an image file to upload
      const hasImageFile = brandData.image instanceof File;

      let response;
      if (hasImageFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("name", brandData.name);
        formData.append("status", brandData.status);
        formData.append("is_home", brandData.is_home);

        if (brandData.image instanceof File) {
          formData.append("image", brandData.image);
        }

        response = await apiClient.post(this.baseURL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Use JSON for regular data
        const jsonData = {
          name: brandData.name,
          status: brandData.status,
          is_home: brandData.is_home,
        };

        // Only include image if it's a string (existing URL) or null
        if (typeof brandData.image === "string" || brandData.image === null) {
          jsonData.image = brandData.image;
        }

        response = await apiClient.post(this.baseURL, jsonData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      console.log("📦 Brand created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating brand:", error);
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

  // Update brand (PUT - full update)
  async updateBrand(id, brandData) {
    try {
      console.log("🔗 Updating brand by ID:", `${this.baseURL}${id}/`);

      // Always use FormData for updates to handle image properly
      const formData = new FormData();
      formData.append("name", brandData.name);
      formData.append("status", brandData.status);
      formData.append("is_home", brandData.is_home);

      // Handle image - only append if it's a File object
      if (brandData.image instanceof File) {
        formData.append("image", brandData.image);
      } else if (brandData.image === null) {
        // If image is null, don't append anything (API will handle it)
        console.log("No image provided for update");
      } else if (
        typeof brandData.image === "string" &&
        brandData.image.trim() !== ""
      ) {
        // If it's a string (existing URL), we need to fetch it as a file
        // For now, we'll skip the image field to avoid the error
        console.log("Skipping existing image URL to avoid API error");
      }

      const response = await apiClient.put(`${this.baseURL}${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("📦 Brand updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating brand:", error);
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

  // Patch brand (PATCH - partial update)
  async patchBrand(id, brandData) {
    try {
      console.log("🔗 Patching brand by ID:", `${this.baseURL}${id}/`);

      // Always use FormData for patches to handle image properly
      const formData = new FormData();

      if (brandData.name !== undefined) {
        formData.append("name", brandData.name);
      }
      if (brandData.status !== undefined) {
        formData.append("status", brandData.status);
      }
      if (brandData.is_home !== undefined) {
        formData.append("is_home", brandData.is_home);
      }

      // Handle image - only append if it's a File object
      if (brandData.image instanceof File) {
        formData.append("image", brandData.image);
      } else if (brandData.image === null) {
        // If image is null, don't append anything (API will handle it)
        console.log("No image provided for patch");
      } else if (
        typeof brandData.image === "string" &&
        brandData.image.trim() !== ""
      ) {
        // If it's a string (existing URL), we need to fetch it as a file
        // For now, we'll skip the image field to avoid the error
        console.log("Skipping existing image URL to avoid API error");
      }

      const response = await apiClient.patch(
        `${this.baseURL}${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("📦 Brand patched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error patching brand:", error);
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

  // Delete brand
  async deleteBrand(id) {
    try {
      console.log("🔗 Deleting brand by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.delete(`${this.baseURL}${id}/`);
      console.log("📦 Brand deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting brand:", error);
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

  // Search brands
  async searchBrands(searchTerm, params = {}) {
    try {
      console.log("🔗 Searching brands:", searchTerm);
      const searchParams = { ...params, search: searchTerm };
      const response = await apiClient.get(this.baseURL, {
        params: searchParams,
      });
      console.log("📦 Brand search results:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error searching brands:", error);
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

  // Get active brands only
  async getActiveBrands(params = {}) {
    try {
      console.log("🔗 Fetching active brands");
      const activeParams = { ...params, status: true };
      const response = await apiClient.get(this.baseURL, {
        params: activeParams,
      });
      console.log("📦 Active brands fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching active brands:", error);
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

export const brandService = new BrandService();
