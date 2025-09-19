import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { assets } from "@/assets/assets";

/**
 * ProductSection Component
 * Displays a section of new arrival products with header and grid layout
 */
const ProductSection = () => {
  // Sample product data - Replace with actual data from API/database
  const newArrivals = [
    {
      id: "1",
      name: "Loveseat Sofa",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format",
      alt: "Loveseat Sofa",
      price: 199.0,
      originalPrice: 400.0,
      rating: 5,
      isNew: true,
      isOnSale: false,
    },
    {
      id: "2",
      name: "Table Lamp",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop&auto=format",
      alt: "Table Lamp",
      price: 24.99,
      rating: 5,
      isNew: true,
      isOnSale: true,
    },
    {
      id: "3",
      name: "Beige Table Lamp",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&auto=format",
      alt: "Beige Table Lamp",
      price: 24.99,
      rating: 5,
      isNew: true,
      isOnSale: false,
    },
    {
      id: "4",
      name: "Bamboo basket",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format",
      alt: "Bamboo basket",
      price: 24.99,
      rating: 4,
      isNew: true,
      isOnSale: true,
    },
    {
      id: "5",
      name: "Toasted",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop&auto=format",
      alt: "Toasted",
      price: 224.99,
      rating: 4,
      isNew: true,
      isOnSale: false,
    },
    {
      id: "6",
      name: "Bamboo basket",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&auto=format",
      alt: "Bamboo basket",
      price: 24.99,
      rating: 4,
      isNew: true,
      isOnSale: true,
    },
    {
      id: "7",
      name: "Toasted",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format",
      alt: "Toasted",
      price: 224.99,
      rating: 4,
      isNew: true,
      isOnSale: false,
    },
  ];

  const handleViewMore = () => {
    // TODO: Implement navigation to products page
    console.log("Navigate to more products");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
              New Arrivals
            </h2>
          </div>

          <Button
            variant="ghost"
            onClick={handleViewMore}
            className="text-black hover:text-gray-700 p-0 h-auto font-medium group"
          >
            More Products
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Products Grid - Horizontal Scroll */}
        <div className="productContainer overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {newArrivals.map((product) => (
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
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
