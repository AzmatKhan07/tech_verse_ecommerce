import apiClient from "../api";

class TaxService {
  constructor() {
    this.baseURL = "/v1/core/taxes/";
  }

  // Get all taxes with pagination, search, and ordering
  async getTaxes(params = {}) {
    try {
      console.log("🔗 Fetching taxes with params:", params);
      const response = await apiClient.get(this.baseURL, { params });
      console.log("📦 Taxes fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching taxes:", error);
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

  // Get single tax by ID
  async getTax(id) {
    try {
      console.log("🔗 Fetching tax by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.get(`${this.baseURL}${id}/`);
      console.log("📦 Tax fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching tax:", error);
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

  // Create new tax
  async createTax(taxData) {
    try {
      console.log("🔗 Creating tax:", taxData);

      const jsonData = {
        tax_desc: taxData.tax_desc,
        tax_value: taxData.tax_value,
        status: taxData.status,
      };

      const response = await apiClient.post(this.baseURL, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Tax created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating tax:", error);
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

  // Update tax (PUT - full update)
  async updateTax(id, taxData) {
    try {
      console.log("🔗 Updating tax by ID:", `${this.baseURL}${id}/`);

      const jsonData = {
        tax_desc: taxData.tax_desc,
        tax_value: taxData.tax_value,
        status: taxData.status,
      };

      const response = await apiClient.put(`${this.baseURL}${id}/`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Tax updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating tax:", error);
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

  // Patch tax (PATCH - partial update)
  async patchTax(id, taxData) {
    try {
      console.log("🔗 Patching tax by ID:", `${this.baseURL}${id}/`);

      const jsonData = {};

      if (taxData.tax_desc !== undefined) {
        jsonData.tax_desc = taxData.tax_desc;
      }
      if (taxData.tax_value !== undefined) {
        jsonData.tax_value = taxData.tax_value;
      }
      if (taxData.status !== undefined) {
        jsonData.status = taxData.status;
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

      console.log("📦 Tax patched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error patching tax:", error);
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

  // Delete tax
  async deleteTax(id) {
    try {
      console.log("🔗 Deleting tax by ID:", `${this.baseURL}${id}/`);
      const response = await apiClient.delete(`${this.baseURL}${id}/`);
      console.log("📦 Tax deleted successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting tax:", error);
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

  // Search taxes
  async searchTaxes(searchTerm, params = {}) {
    try {
      console.log("🔗 Searching taxes:", searchTerm);
      const searchParams = { ...params, search: searchTerm };
      const response = await apiClient.get(this.baseURL, {
        params: searchParams,
      });
      console.log("📦 Tax search results:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error searching taxes:", error);
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

  // Get active taxes only
  async getActiveTaxes(params = {}) {
    try {
      console.log("🔗 Fetching active taxes");
      const activeParams = { ...params, status: true };
      const response = await apiClient.get(this.baseURL, {
        params: activeParams,
      });
      console.log("📦 Active taxes fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching active taxes:", error);
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

export const taxService = new TaxService();
