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
      const response = await apiClient.get(`${this.baseURL}${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
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
        formData.append("category_image", categoryData.image);
        formData.append("is_home", categoryData.is_home || false);
        formData.append(
          "status",
          categoryData.is_active !== undefined ? categoryData.is_active : true
        );

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
          category_image: categoryData.image || "",
          is_home: categoryData.is_home || false,
          status:
            categoryData.is_active !== undefined
              ? categoryData.is_active
              : true,
        };

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

  // Update an existing category
  async updateCategory(id, categoryData) {
    try {
      // Check if we have a file upload
      if (categoryData.image && categoryData.image instanceof File) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append("category_name", categoryData.name);
        formData.append("category_slug", categoryData.slug);
        formData.append("category_image", categoryData.image);
        formData.append("is_home", categoryData.is_home || false);
        formData.append(
          "status",
          categoryData.is_active !== undefined ? categoryData.is_active : true
        );

        console.log("🔗 Updating category with file upload:", {
          id,
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
          `${this.baseURL}/${id}/`,
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
          category_image: categoryData.image || "",
          is_home: categoryData.is_home || false,
          status:
            categoryData.is_active !== undefined
              ? categoryData.is_active
              : true,
        };

        console.log("🔗 Updating category with data:", apiData);
        const response = await apiClient.put(`${this.baseURL}/${id}/`, apiData);
        console.log("📦 Category updated successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  // Partially update a category
  async patchCategory(id, categoryData) {
    try {
      // For partial updates, we only send the fields that are provided
      const apiData = {};

      if (categoryData.name !== undefined)
        apiData.category_name = categoryData.name;
      if (categoryData.slug !== undefined)
        apiData.category_slug = categoryData.slug;
      if (categoryData.image !== undefined)
        apiData.category_image = categoryData.image;
      if (categoryData.is_home !== undefined)
        apiData.is_home = categoryData.is_home;
      if (categoryData.is_active !== undefined)
        apiData.status = categoryData.is_active;

      console.log("🔗 Patching category with data:", apiData);
      const response = await apiClient.patch(`${this.baseURL}/${id}/`, apiData);
      console.log("📦 Category patched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error patching category:", error);
      throw error;
    }
  }

  // Delete a category
  async deleteCategory(id) {
    try {
      const response = await apiClient.delete(`${this.baseURL}${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
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
}

// Create and export a singleton instance
const categoryService = new CategoryService();
export default categoryService;
