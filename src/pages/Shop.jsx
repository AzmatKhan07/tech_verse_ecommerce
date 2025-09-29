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
  const [selectedSort, setSelectedSort] = useState("default");
  const [filters, setFilters] = useState({
    priceRange: [2, 90],
    category: "all",
    sizes: [],
    stockStatus: {
      inStock: false,
      outOfStock: false,
      onBackorder: false,
    },
    ratingFilter: {
      fiveOnly: false,
      fourAndUp: false,
      threeAndUp: false,
      twoAndUp: false,
      oneAndUp: false,
    },
    colors: [],
    brands: [],
  });

  // Build query parameters for advanced search API
  const queryParams = {
    page: currentPage,
    page_size: 12, // Show 12 products per page
    ...(filters.category !== "all" && { category: filters.category }),
    ...(filters.sizes.length > 0 && { size: filters.sizes.join(",") }),
    ...(filters.colors.length > 0 && { color: filters.colors.join(",") }),
    ...(filters.brands.length > 0 && { brand: filters.brands.join(",") }),
    ...(filters.priceRange[0] > 2 && { min_price: filters.priceRange[0] }),
    ...(filters.priceRange[1] < 90 && { max_price: filters.priceRange[1] }),
    ...(filters.stockStatus.inStock && { in_stock: true }),
    ...(filters.stockStatus.outOfStock && { out_of_stock: true }),
    ...(filters.stockStatus.onBackorder && { on_backorder: true }),
    ...(filters.ratingFilter.fiveOnly && { rating: 5 }),
    ...(filters.ratingFilter.fourAndUp && { rating: 4 }),
    ...(filters.ratingFilter.threeAndUp && { rating: 3 }),
    ...(filters.ratingFilter.twoAndUp && { rating: 2 }),
    ...(filters.ratingFilter.oneAndUp && { rating: 1 }),
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

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [2, 90],
      category: "all",
      sizes: [],
      stockStatus: {
        inStock: false,
        outOfStock: false,
        onBackorder: false,
      },
      ratingFilter: {
        fiveOnly: false,
        fourAndUp: false,
        threeAndUp: false,
        twoAndUp: false,
        oneAndUp: false,
      },
      colors: [],
      brands: [],
    });
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Filters */}
              <ShopFilters
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />

              {/* Main Content */}
              <div className="flex-1">
                {/* Controls */}
                <div className="mb-6">
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
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}
                  >
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
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}
                  >
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
                  <div className="mt-8">
                    <ShopPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalCount={totalCount}
                      onPageChange={handlePageChange}
                      onShowMore={handleShowMore}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Shop;
