import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * ShopControls Component
 * Displays sort options and view controls (grid/list view)
 */
const ShopControls = ({ onSortChange }) => {
  const [selectedSort, setSelectedSort] = useState("default");

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-az", label: "Name: A to Z" },
    { value: "name-za", label: "Name: Z to A" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
  ];

  const handleSortChange = (value) => {
    setSelectedSort(value);
    onSortChange?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Sort by</span>
        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopControls;
