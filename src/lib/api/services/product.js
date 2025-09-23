import apiClient from "../api.js";

class ProductService {
  constructor() {
    this.baseURL = "/v1/products";
  }

  // Get all products with optional filtering and pagination
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add all supported parameters from the API
      if (params.brand) queryParams.append("brand", params.brand);
      if (params.category) queryParams.append("category", params.category);
      if (params.is_discounted !== undefined)
        queryParams.append("is_discounted", params.is_discounted);
      if (params.is_featured !== undefined)
        queryParams.append("is_featured", params.is_featured);
      if (params.is_promo !== undefined)
        queryParams.append("is_promo", params.is_promo);
      if (params.is_tranding !== undefined)
        queryParams.append("is_tranding", params.is_tranding);
      if (params.ordering) queryParams.append("ordering", params.ordering);
      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      if (params.page_size) queryParams.append("page_size", params.page_size);

      const url = `${this.baseURL}/products/${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      console.log("🔗 Fetching products from:", url);

      const response = await apiClient.get(url);
      console.log("📦 API Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching products:", error);

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

  // Get a single product by ID
  async getProduct(id) {
    try {
      const response = await apiClient.get(`${this.baseURL}/products/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  // Create a new product
  async createProduct(productData) {
    try {
      const response = await apiClient.post(
        `${this.baseURL}/products/`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  // Update an existing product
  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(
        `${this.baseURL}/products/${id}/`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Partially update a product
  async patchProduct(id, productData) {
    try {
      const response = await apiClient.patch(
        `${this.baseURL}/products/${id}/`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Error patching product:", error);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(
        `${this.baseURL}/products/${id}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Get products with search functionality
  async searchProducts(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return this.getProducts(params);
  }

  // Get featured products
  async getFeaturedProducts() {
    return this.getProducts({ is_featured: true });
  }

  // Get discounted products
  async getDiscountedProducts() {
    return this.getProducts({ is_discounted: true });
  }

  // Get trending products
  async getTrendingProducts() {
    return this.getProducts({ is_tranding: true });
  }

  // Get products by category
  async getProductsByCategory(categoryId) {
    return this.getProducts({ category: categoryId });
  }

  // Get products by brand
  async getProductsByBrand(brandId) {
    return this.getProducts({ brand: brandId });
  }
}

// Create and export a singleton instance
const productService = new ProductService();
export default productService;
