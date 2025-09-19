import React from "react";
import { assets } from "@/assets/assets";
import FeaturedProductCard from "./FeaturedProductCard";

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: "Living Room",
      image: assets.Furniture1,
      alt: "Living Room Furniture",
      size: "large",
    },
    {
      id: 2,
      name: "Bedroom",
      image: assets.Furniture2,
      alt: "Bedroom Furniture",
      size: "small",
    },
    {
      id: 3,
      name: "Kitchen",
      image: assets.Furniture3,
      alt: "Kitchen Appliances",
      size: "small",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Living Room - Large Section */}
          <FeaturedProductCard
            category={categories[0]}
            isLarge={true}
            className="lg:flex-1"
          />

          {/* Right Column - Bedroom and Kitchen */}
          <div className="flex flex-col lg:flex-1 gap-6">
            <FeaturedProductCard category={categories[1]} />
            <FeaturedProductCard category={categories[2]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
