// Simple test file to verify ProductService functionality
import productService from "../product";

// Mock the apiClient
jest.mock("../../api.js", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

describe("ProductService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch products with correct URL and parameters", async () => {
    const mockResponse = {
      data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
      },
    };

    const { default: apiClient } = await import("../../api.js");
    apiClient.get.mockResolvedValue(mockResponse);

    const result = await productService.getProducts({ page: 1, page_size: 20 });

    expect(apiClient.get).toHaveBeenCalledWith(
      "/v1/products/products/?page=1&page_size=20"
    );
    expect(result).toEqual(mockResponse.data);
  });

  test("should handle search parameters correctly", async () => {
    const mockResponse = {
      data: {
        count: 1,
        results: [{ id: 1, name: "Test Product" }],
      },
    };

    const { default: apiClient } = await import("../../api.js");
    apiClient.get.mockResolvedValue(mockResponse);

    const result = await productService.searchProducts("test", { category: 1 });

    expect(apiClient.get).toHaveBeenCalledWith(
      "/v1/products/products/?search=test&category=1"
    );
    expect(result).toEqual(mockResponse.data);
  });

  test("should handle errors gracefully", async () => {
    const { default: apiClient } = await import("../../api.js");
    apiClient.get.mockRejectedValue(new Error("Network error"));

    await expect(productService.getProducts()).rejects.toThrow("Network error");
  });
});
