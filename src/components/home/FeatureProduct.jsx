import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { assets } from "@/assets/assets";

/**
 * FeatureProduct Component
 * Displays a section of featured products with header and horizontal scroll layout
 */
const FeatureProduct = () => {
  // Featured product data - Different from New Arrivals
  const featuredProducts = [
    {
      id: "f1",
      name: "Modern Dining Table",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format",
      alt: "Modern Dining Table",
      price: 599.99,
      originalPrice: 799.99,
      rating: 5,
      isNew: false,
      isOnSale: true,
    },
    {
      id: "f2",
      name: "Contemporary Chair",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop&auto=format",
      alt: "Contemporary Chair",
      price: 299.99,
      rating: 4,
      isNew: false,
      isOnSale: false,
    },
    {
      id: "f3",
      name: "Minimalist Bookshelf",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&auto=format",
      alt: "Minimalist Bookshelf",
      price: 199.99,
      originalPrice: 249.99,
      rating: 5,
      isNew: true,
      isOnSale: true,
    },
    {
      id: "f4",
      name: "Designer Coffee Table",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format",
      alt: "Designer Coffee Table",
      price: 449.99,
      rating: 4,
      isNew: false,
      isOnSale: false,
    },
    {
      id: "f5",
      name: "Luxury Sofa Set",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format",
      alt: "Luxury Sofa Set",
      price: 1299.99,
      originalPrice: 1599.99,
      rating: 5,
      isNew: true,
      isOnSale: true,
    },
    {
      id: "f6",
      name: "Executive Office Desk",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&auto=format",
      alt: "Executive Office Desk",
      price: 799.99,
      rating: 4,
      isNew: false,
      isOnSale: false,
    },
    {
      id: "f7",
      name: "Vintage Side Table",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop&auto=format",
      alt: "Vintage Side Table",
      price: 179.99,
      originalPrice: 229.99,
      rating: 4,
      isNew: false,
      isOnSale: true,
    },
  ];

  const handleViewMore = () => {
    // TODO: Implement navigation to featured products page
    console.log("Navigate to featured products");
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
          <div className="flex gap-6 min-w-max">
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px]">
                <ProductCard product={product} className="h-full w-full" />
              </div>
            ))}
          </div>
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
