import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Filter, X } from "lucide-react";
import {
  useCategories,
  useActiveCategories,
} from "@/lib/query/hooks/useCategories";
import { useSizes } from "@/lib/query/hooks/useSizes";
import { useColors } from "@/lib/query/hooks/useColors";
import { useBrands } from "@/lib/query/hooks/useBrands";

/**
 * ShopFilters Component
 * Comprehensive filter sidebar matching the design in the image
 */
const ShopFilters = ({ onFiltersChange, onClearFilters }) => {
  // Mobile state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState([2, 90]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stockStatus, setStockStatus] = useState({
    inStock: false,
    outOfStock: false,
    onBackorder: false,
  });
  const [ratingFilter, setRatingFilter] = useState({
    fiveOnly: false,
    fourAndUp: false,
    threeAndUp: false,
    twoAndUp: false,
    oneAndUp: false,
  });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // API data
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useActiveCategories();
  const { data: sizesData } = useSizes({ is_active: true });
  const {
    data: colorsData,
    isLoading: colorsLoading,
    error: colorsError,
  } = useColors({ status: true });
  const { data: brandsData } = useBrands({ is_active: true });

  // Handle different data structures with fallback
  const categories = categoriesData?.categories ||
    categoriesData?.results ||
    categoriesData || [
      { id: 1, name: "Electronics" },
      { id: 2, name: "Clothing" },
      { id: 3, name: "Home & Garden" },
      { id: 4, name: "Sports" },
      { id: 5, name: "Books" },
    ];
  const sizes = sizesData?.sizes ||
    sizesData?.results ||
    sizesData || [
      { id: 1, name: "S" },
      { id: 2, name: "M" },
      { id: 3, name: "L" },
      { id: 4, name: "XL" },
    ];
  const colors = colorsData?.results || colorsData || [];

  // Debug logging for colors
  console.log("🎨 Colors Debug:", {
    colorsData,
    colors,
    colorsLoading,
    colorsError,
    colorsCount: colors.length,
  });
  const brands = brandsData?.brands ||
    brandsData?.results ||
    brandsData || [
      { id: 1, name: "Brand A" },
      { id: 2, name: "Brand B" },
      { id: 3, name: "Brand C" },
    ];

  // Debug logging
  console.log("=== FILTER DEBUG ===");
  console.log("Categories data:", categoriesData);
  console.log("Categories array:", categories);
  console.log("Categories loading:", categoriesLoading);
  console.log("Categories error:", categoriesError);
  console.log("Sizes data:", sizesData);
  console.log("Sizes array:", sizes);
  console.log("Colors data:", colorsData);
  console.log("Colors array:", colors);
  console.log("Brands data:", brandsData);
  console.log("Brands array:", brands);
  console.log("===================");

  // Sample product images for color filter (you can replace with actual product images)
  const colorImages = {
    Black: "/placeholder-black.jpg",
    White: "/placeholder-white.jpg",
    Red: "/placeholder-red.jpg",
    Blue: "/placeholder-blue.jpg",
    Green: "/placeholder-green.jpg",
    Yellow: "/placeholder-yellow.jpg",
    Gray: "/placeholder-gray.jpg",
  };

  // Handle price range change
  const handlePriceChange = (value) => {
    setPriceRange(value);
    updateFilters();
  };

  // Handle category selection
  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    updateFilters();
  };

  // Handle size selection
  const handleSizeChange = (sizeId, checked) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, sizeId]);
    } else {
      setSelectedSizes(selectedSizes.filter((id) => id !== sizeId));
    }
    updateFilters();
  };

  // Handle stock status change
  const handleStockStatusChange = (status, checked) => {
    setStockStatus((prev) => ({
      ...prev,
      [status]: checked,
    }));
    updateFilters();
  };

  // Handle rating filter change
  const handleRatingChange = (rating, checked) => {
    setRatingFilter((prev) => ({
      ...prev,
      [rating]: checked,
    }));
    updateFilters();
  };

  // Handle color selection
  const handleColorChange = (colorId, checked) => {
    if (checked) {
      setSelectedColors([...selectedColors, colorId]);
    } else {
      setSelectedColors(selectedColors.filter((id) => id !== colorId));
    }
    updateFilters();
  };

  // Handle brand selection
  const handleBrandChange = (brandId, checked) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId]);
    } else {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
    }
    updateFilters();
  };

  // Update filters and notify parent
  const updateFilters = () => {
    const filters = {
      priceRange,
      category: selectedCategory,
      sizes: selectedSizes,
      stockStatus,
      ratingFilter,
      colors: selectedColors,
      brands: selectedBrands,
    };
    onFiltersChange?.(filters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setPriceRange([2, 90]);
    setSelectedCategory("all");
    setSelectedSizes([]);
    setStockStatus({
      inStock: false,
      outOfStock: false,
      onBackorder: false,
    });
    setRatingFilter({
      fiveOnly: false,
      fourAndUp: false,
      threeAndUp: false,
      twoAndUp: false,
      oneAndUp: false,
    });
    setSelectedColors([]);
    setSelectedBrands([]);
    onClearFilters?.();
  };

  // Mobile filter handlers
  const handleMobileFiltersToggle = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  const handleMobileFiltersClose = () => {
    setIsMobileFiltersOpen(false);
  };

  // Filter section component
  const FilterSection = ({ title, children, collapsible = true }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {collapsible && <Minus className="w-4 h-4 text-gray-400" />}
      </div>
      {children}
    </div>
  );

  // Filter content component
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Filter */}
      <FilterSection title="Price">
        <div className="space-y-4">
          {/* Price Range Display */}
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              ${priceRange[0]}
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              ${priceRange[1]}
            </div>
          </div>

          {/* Price Slider */}
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={90}
            min={2}
            step={1}
            className="w-full"
          />

          {/* Price Labels */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>2</span>
            <span>24</span>
            <span>46</span>
            <span>68</span>
            <span>90</span>
          </div>

          {/* Manual Price Input */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value) || 2, priceRange[1]])
              }
              className="w-16 h-8 text-sm"
              placeholder="$ 2"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value) || 90])
              }
              className="w-16 h-8 text-sm"
              placeholder="90"
            />
          </div>
        </div>
      </FilterSection>

      {/* Product Categories Filter */}
      <FilterSection title="Product categories">
        <div className="space-y-2">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full h-8 text-sm border-gray-300">
              <SelectValue
                placeholder={
                  categoriesLoading ? "Loading..." : "Select category"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="font-medium">All Categories</span>
              </SelectItem>
              {categoriesLoading ? (
                <SelectItem value="loading" disabled>
                  <span className="font-medium">Loading categories...</span>
                </SelectItem>
              ) : categoriesError ? (
                <SelectItem value="error" disabled>
                  <span className="font-medium text-red-500">
                    Error loading categories
                  </span>
                </SelectItem>
              ) : categories.length === 0 ? (
                <SelectItem value="empty" disabled>
                  <span className="font-medium text-gray-500">
                    No categories found
                  </span>
                </SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <span className="font-medium">
                      {category.category_name}
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </FilterSection>

      {/* Size Filter */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.length === 0 ? (
            <div className="text-sm text-gray-500">No sizes available</div>
          ) : (
            sizes.map((size) => (
              <Badge
                key={size.id}
                variant={
                  selectedSizes.includes(size.id) ? "default" : "outline"
                }
                className={`cursor-pointer px-3 py-1 ${
                  selectedSizes.includes(size.id)
                    ? "bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
                onClick={() =>
                  handleSizeChange(size.id, !selectedSizes.includes(size.id))
                }
              >
                {size.size}
              </Badge>
            ))
          )}
        </div>
      </FilterSection>

      {/* Stock Status Filter */}
      <FilterSection title="Stock status">
        <div className="space-y-3">
          {[
            { key: "inStock", label: "In Stock" },
            { key: "outOfStock", label: "Out of Stock" },
            { key: "onBackorder", label: "On Backorder" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <Switch
                checked={stockStatus[key]}
                onCheckedChange={(checked) =>
                  handleStockStatusChange(key, checked)
                }
              />
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Rating Filter
      <FilterSection title="Rating">
        <div className="space-y-2">
          {[
            { key: "fiveOnly", label: "5 only" },
            { key: "fourAndUp", label: "4 and up" },
            { key: "threeAndUp", label: "3 and up" },
            { key: "twoAndUp", label: "2 and up" },
            { key: "oneAndUp", label: "1 and up" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${key}`}
                checked={ratingFilter[key]}
                onCheckedChange={(checked) => handleRatingChange(key, checked)}
              />
              <label
                htmlFor={`rating-${key}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </FilterSection> */}

      {/* Color Filter */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {colorsLoading ? (
            <div className="text-sm text-gray-500">Loading colors...</div>
          ) : colorsError ? (
            <div className="text-sm text-red-500">Error loading colors</div>
          ) : colors.length === 0 ? (
            <div className="text-sm text-gray-500">No colors available</div>
          ) : (
            colors.map((color) => {
              return (
                <div
                  key={color.id}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                    selectedColors.includes(color.id)
                      ? "border-black"
                      : `${color.color}`
                  }`}
                  style={{
                    backgroundColor: color.color || "#cccccc",
                  }}
                  onClick={() =>
                    handleColorChange(
                      color.id,
                      !selectedColors.includes(color.id)
                    )
                  }
                  title={color.color || "Color"}
                />
              );
            })
          )}
        </div>
      </FilterSection>

      {/* Clear Button */}
      <div className="mt-6">
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full"
        >
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={handleMobileFiltersToggle}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white p-4 border-r border-gray-200">
        <FilterContent />
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-white shadow-xl overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                onClick={handleMobileFiltersClose}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter Content */}
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopFilters;
