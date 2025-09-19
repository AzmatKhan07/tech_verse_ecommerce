import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * ShopFilters Component
 * Displays category and price filters for the shop
 */
const ShopFilters = ({ onCategoryChange, onPriceChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("living-room");
  const [selectedPrice, setSelectedPrice] = useState("all-price");

  const categories = [
    { value: "living-room", label: "Living Room" },
    { value: "bedroom", label: "Bedroom" },
    { value: "kitchen", label: "Kitchen" },
    { value: "office", label: "Office" },
    { value: "outdoor", label: "Outdoor" },
    { value: "dining", label: "Dining Room" },
  ];

  const priceRanges = [
    { value: "all-price", label: "All Price" },
    { value: "0-50", label: "$0 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-200", label: "$100 - $200" },
    { value: "200-500", label: "$200 - $500" },
    { value: "500+", label: "$500+" },
  ];

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    onCategoryChange?.(value);
  };

  const handlePriceChange = (value) => {
    setSelectedPrice(value);
    onPriceChange?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 w-2/5">
      {/* Categories Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CATEGORIES
        </label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full border-2 border-gray-500 outline-none">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <span className="font-bold">{category.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          PRICE
        </label>
        <Select value={selectedPrice} onValueChange={handlePriceChange}>
          <SelectTrigger className="w-full border-2 border-gray-500 outline-none">
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((price) => (
              <SelectItem key={price.value} value={price.value}>
                <span className="font-bold">{price.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopFilters;
