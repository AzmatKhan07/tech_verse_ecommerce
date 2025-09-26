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
      if (params.is_arrival !== undefined)
        queryParams.append("is_arrival", params.is_arrival);
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

      // Transform the API response to match our expected format
      const transformedData = {
        products: response.data.results || response.data,
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

  // Get a single product by slug
  async getProduct(slug) {
    try {
      console.log("🔗 Fetching product by slug:", slug);
      const url = `${this.baseURL}/products/${slug}/`;
      console.log("🔗 Full URL:", url);
      console.log("🔗 API Client baseURL:", apiClient.defaults.baseURL);

      const response = await apiClient.get(url);
      console.log("📦 Product data:", response.data);
      console.log(
        "📦 Product data structure:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("📦 Response status:", response.status);
      console.log("📦 Response headers:", response.headers);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      }
      throw error;
    }
  }

  // Create a new product
  async createProduct(productData) {
    try {
      console.log("🔗 Creating product...");
      console.log(
        "📦 Product data type:",
        productData instanceof FormData ? "FormData" : "JSON"
      );

      const response = await apiClient.post(
        `${this.baseURL}/products/`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error creating product:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  }

  // Update an existing product by slug
  async updateProduct(slug, productData) {
    try {
      console.log("🔗 Updating product...");
      console.log("📦 Product slug:", slug);
      console.log(
        "📦 Product data type:",
        productData instanceof FormData ? "FormData" : "JSON"
      );

      const response = await apiClient.put(
        `${this.baseURL}/products/${slug}/`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error updating product:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  }

  // Partially update a product by slug
  async patchProduct(slug, productData) {
    try {
      const response = await apiClient.patch(
        `${this.baseURL}/products/${slug}/`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Error patching product:", error);
      throw error;
    }
  }

  // Delete a product by slug
  async deleteProduct(slug) {
    try {
      console.log(
        "🔗 Deleting product by slug:",
        `${this.baseURL}/products/${slug}/`
      );
      const response = await apiClient.delete(
        `${this.baseURL}/products/${slug}/`
      );
      console.log("📦 Product deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting product:", error);
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
