import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3X3, Grid2X2, LayoutList, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ShopControls Component
 * Displays sort options and view controls (grid/list view)
 */
const ShopControls = ({
  onSortChange,
  onViewChange,
  currentView = "grid4",
}) => {
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

  const viewOptions = [
    { id: "grid4", icon: Grid3X3, label: "4 columns" },
    { id: "grid3", icon: Grid2X2, label: "3 columns" },
    { id: "grid2", icon: LayoutList, label: "2 columns" },
    { id: "list", icon: Minus, label: "List view" },
  ];

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
