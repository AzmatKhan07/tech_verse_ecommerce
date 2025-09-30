import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { assets } from "@/assets/assets";
import { useProducts } from "@/lib/query/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

/**
 * FeatureProduct Component
 * Displays a section of featured products with header and horizontal scroll layout
 */
const FeatureProduct = () => {
  // Fetch featured products from API
  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    is_featured: true,
    page_size: 10,
    ordering: "-created_at", // Latest first
  });

  // Use API products if available, otherwise fallback to empty array
  const featuredProducts = productsData?.products || [];

  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/shop");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Feature Product
            </h2>
          </div>

          <Button
            variant="ghost"
            onClick={handleViewMore}
            className="text-black hover:text-gray-700 p-0 h-auto font-medium group"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Products Grid - Horizontal Scroll */}
        <div className="productContainer overflow-x-auto pb-4">
          {isLoading ? (
            <div className="flex gap-6 min-w-max">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px]">
                  <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Failed to load featured products. Please try again later.
              </p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="flex gap-6 min-w-max">
              {featuredProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[280px]">
                  <ProductCard product={product} className="h-full w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No featured products available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Mobile View More Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <Button
            onClick={handleViewMore}
            variant="outline"
            className="px-8 py-2"
          >
            View All Featured Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureProduct;
