import React from "react";
import { assets } from "@/assets/assets";
import FeaturedProductCard from "./FeaturedProductCard";
import { useCategories } from "@/lib/query/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const CategorySection = () => {
  // Fetch top 3 active categories that are marked for home page
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useCategories({
    is_active: true,
    is_home: true,
    page_size: 3,
    ordering: "-created_at", // Get latest categories first
  });

  // Use API categories if available, otherwise fallback to static
  const categories =
    categoriesData?.categories?.length > 0
      ? categoriesData.categories
          .filter((category) => category.is_home === true) // Only show categories marked for home
          .slice(0, 3)
          .map((category, index) => ({
            id: category.id,
            name: category.category_name || category.name,
            slug: category.category_slug || category.slug,
            image: category.category_image || assets.Furniture1,
            alt: `${category.category_name || category.name} Category`,
            size: index === 0 ? "large" : "small", // First category is large
          }))
      : [
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

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Large skeleton */}
            <Skeleton className="lg:flex-1 h-[400px] rounded-lg" />
            {/* Small skeletons */}
            <div className="flex flex-col lg:flex-1 gap-6">
              <Skeleton className="h-[190px] rounded-lg" />
              <Skeleton className="h-[190px] rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state with fallback
  if (error) {
    console.warn("Failed to load categories, using fallback:", error);
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* First Category - Large Section */}
          {categories[0] && (
            <FeaturedProductCard
              category={categories[0]}
              isLarge={true}
              className="lg:flex-1"
            />
          )}

          {/* Right Column - Second and Third Categories */}
          <div className="flex flex-col lg:flex-1 gap-6">
            {categories[1] && <FeaturedProductCard category={categories[1]} />}
            {categories[2] && <FeaturedProductCard category={categories[2]} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
