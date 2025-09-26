import React, { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopControls from "@/components/shop/ShopControls";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ShopPagination from "@/components/shop/ShopPagination";
import { useProducts } from "@/lib/query/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all-price");
  const [selectedSort, setSelectedSort] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  // Build query parameters for API
  const queryParams = {
    page: currentPage,
    page_size: 12, // Show 12 products per page
    ...(selectedCategory !== "all" && { category: selectedCategory }),
    ...(searchTerm && { search: searchTerm }),
    ...(selectedSort !== "default" && { ordering: selectedSort }),
  };

  // Fetch products from API
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useProducts(queryParams);

  // Extract data from the query result
  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {
    count: 0,
    totalPages: 1,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
  };
  const totalCount = pagination.count;
  const totalPages = pagination.totalPages;

  // Debounced search effect - reset to page 1 when search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePriceChange = (price) => {
    setSelectedPrice(price);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
  };

  const handleShowMore = () => {
    // Logic to load more products
    console.log("Loading more products...");
  };

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Shop Header */}
        <ShopHeader />

        {/* Shop Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="flex justify-between">
              <ShopFilters
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onSearchChange={handleSearchChange}
                searchTerm={searchTerm}
              />

              {/* Controls */}
              <ShopControls onSortChange={handleSortChange} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  {error.message ||
                    "Failed to load products. Please try again."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6`}>
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6`}>
                {products.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <ShopPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                onShowMore={handleShowMore}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Shop;
