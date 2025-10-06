import apiClient from "../api.js";

class CategoryService {
  constructor() {
    this.baseURL = "/v1/core/categories";
  }

  // Get all categories with optional filtering and pagination
  async getCategories(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add all supported parameters
      if (params.ordering) queryParams.append("ordering", params.ordering);
      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      if (params.page_size) queryParams.append("page_size", params.page_size);
      if (params.is_active !== undefined)
        queryParams.append("is_active", params.is_active);

      const url = `${this.baseURL}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      console.log("🔗 Fetching categories from:", url);

      const response = await apiClient.get(url);
      console.log("📦 Categories API Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching categories:", error);

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

  // Get a single category by ID
  async getCategory(id) {
    try {
      console.log("🔗 Fetching category:", `${this.baseURL}/${id}/`);
      const response = await apiClient.get(`${this.baseURL}/${id}/`);
      console.log("📦 Category fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching category:", error);

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

  // Create a new category
  async createCategory(categoryData) {
    try {
      // Check if we have a file upload
      if (categoryData.image && categoryData.image instanceof File) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append("category_name", categoryData.name);
        formData.append("category_slug", categoryData.slug);
        if (categoryData.image && categoryData.image instanceof File) {
          formData.append("category_image", categoryData.image);
        }
        formData.append("is_home", categoryData.is_home || false);
        formData.append(
          "status",
          categoryData.is_active !== undefined ? categoryData.is_active : true
        );
        // Only append parent_category if it's not 0 (no parent)
        if (
          categoryData.parent_category &&
          categoryData.parent_category !== 0
        ) {
          formData.append("parent_category", categoryData.parent_category);
        }

        console.log("🔗 Creating category with file upload:", {
          category_name: categoryData.name,
          category_slug: categoryData.slug,
          hasImage: !!categoryData.image,
          is_home: categoryData.is_home || false,
          status:
            categoryData.is_active !== undefined
              ? categoryData.is_active
              : true,
        });

        const response = await apiClient.post(`${this.baseURL}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("📦 Category created successfully:", response.data);
        return response.data;
      } else {
        // Use JSON for regular data
        const apiData = {
          category_name: categoryData.name,
          category_slug: categoryData.slug,
          is_home: categoryData.is_home || false,
          status:
            categoryData.is_active !== undefined
              ? categoryData.is_active
              : true,
          // Only include parent_category if it's not 0 (no parent)
          ...(categoryData.parent_category &&
            categoryData.parent_category !== 0 && {
              parent_category: categoryData.parent_category,
            }),
        };

        // Only include category_image if it's a string (existing image URL)
        if (categoryData.image && typeof categoryData.image === "string") {
          apiData.category_image = categoryData.image;
        } else if (categoryData.image === null) {
          // Explicitly set to null to remove existing image
          apiData.category_image = null;
        }

        console.log("🔗 Creating category with data:", apiData);
        const response = await apiClient.post(`${this.baseURL}/`, apiData);
        console.log("📦 Category created successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  // Update an existing category by slug
  async updateCategory(slug, categoryData) {
    try {
      // Check if we have a file upload
      if (categoryData.image && categoryData.image instanceof File) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append("category_name", categoryData.name);
        formData.append("category_slug", categoryData.slug);
        if (categoryData.image && categoryData.image instanceof File) {
          formData.append("category_image", categoryData.image);
        }
        formData.append("is_home", categoryData.is_home || false);
        formData.append(
          "status",
          categoryData.is_active !== undefined ? categoryData.is_active : true
        );
        // Only append parent_category if it's not 0 (no parent)
        if (
          categoryData.parent_category &&
          categoryData.parent_category !== 0
        ) {
          formData.append("parent_category", categoryData.parent_category);
        }

        console.log("🔗 Updating category with file upload:", {
          slug,
          category_name: categoryData.name,
          category_slug: categoryData.slug,
          hasImage: !!categoryData.image,
          is_home: categoryData.is_home || false,
          status:
            categoryData.is_active !== undefined
              ? categoryData.is_active
              : true,
        });

        const response = await apiClient.put(
          `${this.baseURL}/${slug}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("📦 Category updated successfully:", response.data);
        return response.data;
      } else {
        // Use JSON for regular data
        const apiData = {
          category_name: categoryData.name,
          category_slug: categoryData.slug,
          is_home: categoryData.is_home || false,
          status:
            categoryData.is_active !== undefined
              ? categoryData.is_active
              : true,
          // Only include parent_category if it's not 0 (no parent)
          ...(categoryData.parent_category &&
            categoryData.parent_category !== 0 && {
              parent_category: categoryData.parent_category,
            }),
        };

        // Handle category_image
        if (categoryData.image === null) {
          // Explicitly set to null to remove existing image
          apiData.category_image = null;
        } else if (
          categoryData.image &&
          typeof categoryData.image === "string"
        ) {
          // Existing image URL - don't send it to backend, let backend preserve it
          // The backend will keep the current image if no new file is provided
        } else if (categoryData.image === undefined) {
          // No image provided - preserve existing image by not including the field
          // This means the backend will keep the current image
        }

        console.log("🔗 Updating category with data:", apiData);
        const response = await apiClient.put(
          `${this.baseURL}/${slug}/`,
          apiData
        );
        console.log("📦 Category updated successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  // Partially update a category by slug
  async patchCategory(slug, categoryData) {
    try {
      // For partial updates, we only send the fields that are provided
      const apiData = {};

      if (categoryData.name !== undefined)
        apiData.category_name = categoryData.name;
      if (categoryData.slug !== undefined)
        apiData.category_slug = categoryData.slug;
      if (categoryData.image !== undefined) {
        if (typeof categoryData.image === "string") {
          apiData.category_image = categoryData.image;
        } else if (categoryData.image === null) {
          // Explicitly set to null to remove existing image
          apiData.category_image = null;
        }
      }
      if (categoryData.is_home !== undefined)
        apiData.is_home = categoryData.is_home;
      if (categoryData.is_active !== undefined)
        apiData.status = categoryData.is_active;
      if (
        categoryData.parent_category !== undefined &&
        categoryData.parent_category !== 0
      )
        apiData.parent_category = categoryData.parent_category;

      console.log("🔗 Patching category with data:", apiData);
      const response = await apiClient.patch(
        `${this.baseURL}/${slug}/`,
        apiData
      );
      console.log("📦 Category patched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error patching category:", error);
      throw error;
    }
  }

  // Delete a category by slug
  async deleteCategory(slug) {
    try {
      console.log("🔗 Deleting category by slug:", `${this.baseURL}/${slug}/`);
      const response = await apiClient.delete(`${this.baseURL}/${slug}/`);
      console.log("📦 Category deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting category:", error);

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

  // Search categories
  async searchCategories(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return this.getCategories(params);
  }

  // Get active categories only
  async getActiveCategories() {
    return this.getCategories({ is_active: true });
  }

  // Get category KPIs/statistics
  async getCategoryKPIs() {
    try {
      console.log(
        "🔗 Fetching category KPIs from:",
        `${this.baseURL}/category-kpis/`
      );
      const response = await apiClient.get(`${this.baseURL}/category-kpis/`);
      console.log("📦 Category KPIs API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching category KPIs:", error);

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
}

// Create and export a singleton instance
const categoryService = new CategoryService();
export default categoryService;
