import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopControls from "@/components/shop/ShopControls";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ShopPagination from "@/components/shop/ShopPagination";

const Shop = () => {
  const [currentView, setCurrentView] = useState("grid4");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("living-room");
  const [selectedPrice, setSelectedPrice] = useState("all-price");
  const [selectedSort, setSelectedSort] = useState("default");

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

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowMore = () => {
    // Logic to load more products
    console.log("Loading more products...");
  };

  // Sample products data - moved from ShopGrid
  const sampleProducts = [
    {
      id: "1",
      name: "Off-white Pillow",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&auto=format",
      alt: "Off-white Pillow",
      price: 7.99,
      originalPrice: 13.0,
      rating: 5,
      isNew: true,
      isOnSale: true,
      description:
        "Super-soft cushion cover in off-white with a tactile pattern that enhances the different tones in the pile and base.",
    },
    {
      id: "2",
      name: "Table Lamp",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format",
      alt: "Table Lamp",
      price: 39.99,
      rating: 5,
      isNew: true,
      description:
        "Like small jewels in shiny brass and grey clear glass, spread a soft mood light that creates exciting shadows on walls and ceilings.",
    },
    {
      id: "3",
      name: "White Drawer unit",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&auto=format",
      alt: "White Drawer unit",
      price: 89.99,
      rating: 5,
      isNew: true,
      description:
        "Super-soft cushion cover in off-white with a tactile pattern that enhances the different tones in the pile and base.",
    },
    {
      id: "4",
      name: "Cozy Sofa",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&auto=format",
      alt: "Cozy Sofa",
      price: 299.0,
      rating: 5,
      isNew: true,
      description:
        "Easy transportation was the goal when we created this comfy loveseat with durable beige polyester fabric.",
    },
    {
      id: "5",
      name: "Bamboo Basket",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop&auto=format",
      alt: "Bamboo Basket",
      price: 9.99,
      rating: 5,
      description:
        "With its soft shape and color, this spacious basket is just as decorative wherever you choose to put it.",
    },
    {
      id: "6",
      name: "Black Tray table",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&auto=format",
      alt: "Black Tray table",
      price: 19.19,
      rating: 5,
      description:
        "Easy to love at a price that's hard to resist. Buy one or buy a few and make every space where you sit more convenient.",
    },
  ];

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
              />

              {/* Controls */}
              <ShopControls
                onSortChange={handleSortChange}
                currentView={currentView}
              />
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6`}>
              {sampleProducts.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <ShopPagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={handlePageChange}
              onShowMore={handleShowMore}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Shop;
