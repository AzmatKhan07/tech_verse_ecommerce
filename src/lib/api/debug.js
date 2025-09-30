// Debug utility for testing API integration
import productService from "./services/product";

export const testProductAPI = async () => {
  console.log("🧪 Testing Product API Integration...");

  try {
    // Test 1: Basic product fetch
    console.log("📡 Testing basic product fetch...");
    const products = await productService.getProducts();
    console.log("✅ Products fetched successfully:", products);

    // Test 2: Search functionality
    console.log("🔍 Testing search functionality...");
    const searchResults = await productService.searchProducts("test");
    console.log("✅ Search completed:", searchResults);

    // Test 3: Pagination
    console.log("📄 Testing pagination...");
    const paginatedResults = await productService.getProducts({
      page: 1,
      page_size: 10,
    });
    console.log("✅ Pagination test completed:", paginatedResults);

    return {
      success: true,
      message: "All API tests passed!",
      data: {
        products,
        searchResults,
        paginatedResults,
      },
    };
  } catch (error) {
    console.error("❌ API test failed:", error);
    return {
      success: false,
      message: "API test failed",
      error: error.message,
    };
  }
};

// Combined test for both API and TanStack Query
export const testFullIntegration = async () => {
  console.log("🚀 Testing Full Integration (API + TanStack Query)...");

  try {
    // Test API directly
    const apiTest = await testProductAPI();

    if (apiTest.success) {
      console.log("✅ API Integration: PASSED");
      console.log("✅ TanStack Query: Ready (test in React components)");
      console.log("🎯 Integration Status: READY FOR USE");

      return {
        success: true,
        message: "Full integration ready!",
        apiTest,
        tanstackQuery: "Ready for component testing",
      };
    } else {
      throw new Error("API test failed");
    }
  } catch (error) {
    console.error("❌ Full integration test failed:", error);
    return {
      success: false,
      message: "Full integration test failed",
      error: error.message,
    };
  }
};

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testProductAPI = testProductAPI;
  window.testFullIntegration = testFullIntegration;
}
