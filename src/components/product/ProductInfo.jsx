import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import LoginRequiredModal from "@/components/common/LoginRequiredModal";

/**
 * ProductInfo Component
 * Displays product information, pricing, options, and action buttons with dynamic countdown timer
 */
const ProductInfo = ({ product, selectedVariant, onVariantSelect }) => {
  const { addToCart, isInCart, requiresLogin } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    name = "Tray Table",
    rating = 5,
    reviewCount = 11,
    description = "Buy one or buy a few and make every space where you sit more convenient. Light and easy to move around with removable tray top, handy for serving snacks.",
    price = 199.0,
    originalPrice = 400.0,
    offerTimer = { days: 2, hours: 12, minutes: 45, seconds: 5 },
    measurements = '17 1/2×20 5/8"',
    colors = [
      {
        name: "Black",
        value: "black",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&auto=format",
      },
      {
        name: "Beige",
        value: "beige",
        image:
          "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100&h=100&fit=crop&auto=format",
      },
      {
        name: "Red",
        value: "red",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop&auto=format",
      },
      {
        name: "White",
        value: "white",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&auto=format",
      },
    ],
    sku = "1117",
    category = "Living Room, Bedroom",
    attributes = [],
  } = product;

  // Format price to currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get color hex code from color name
  const getColorFromName = (colorName) => {
    if (!colorName) return "#cccccc";

    const colorMap = {
      black: "#000000",
      white: "#ffffff",
      red: "#ff0000",
      blue: "#0000ff",
      green: "#00ff00",
      yellow: "#ffff00",
      orange: "#ffa500",
      purple: "#800080",
      pink: "#ffc0cb",
      gray: "#808080",
      grey: "#808080",
      brown: "#a52a2a",
      navy: "#000080",
      maroon: "#800000",
      olive: "#808000",
      lime: "#00ff00",
      aqua: "#00ffff",
      teal: "#008080",
      silver: "#c0c0c0",
      gold: "#ffd700",
      beige: "#f5f5dc",
      tan: "#d2b48c",
      cream: "#fffdd0",
      ivory: "#fffff0",
      coral: "#ff7f50",
      salmon: "#fa8072",
      turquoise: "#40e0d0",
      lavender: "#e6e6fa",
      magenta: "#ff00ff",
      cyan: "#00ffff",
      indigo: "#4b0082",
      violet: "#ee82ee",
      khaki: "#f0e68c",
      plum: "#dda0dd",
      mint: "#f5fffa",
      peach: "#ffcba4",
      rose: "#ff69b4",
      sky: "#87ceeb",
      forest: "#228b22",
      emerald: "#50c878",
      ruby: "#e0115f",
      sapphire: "#0f52ba",
      amber: "#ffbf00",
      jade: "#00a86b",
      pearl: "#f8f6f0",
      charcoal: "#36454f",
      slate: "#708090",
      steel: "#4682b4",
      bronze: "#cd7f32",
      copper: "#b87333",
    };

    return colorMap[colorName.toLowerCase()] || "#cccccc";
  };

  // Generate star rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-black text-black"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    // Check if user needs to login first
    if (requiresLogin) {
      setShowLoginModal(true);
      return;
    }

    // Create product object with selected variant
    const productToAdd = {
      ...product,
      selectedVariant: selectedVariant,
      selectedColor: selectedVariant
        ? { name: selectedVariant.color_name }
        : colors[selectedColor],
      color: selectedVariant
        ? selectedVariant.color_name
        : colors[selectedColor].name,
      image:
        selectedVariant?.attr_image ||
        colors[selectedColor].image ||
        product.images?.[0]?.url,
      price: selectedVariant ? parseFloat(selectedVariant.price) : price,
      sku: selectedVariant?.sku || sku,
    };

    addToCart(productToAdd, quantity);
  };

  const handleAddToWishlist = () => {
    console.log(`Adding ${name} to wishlist`);
    // TODO: Implement wishlist functionality
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-black mb-3">
          {name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">{renderStars()}</div>
          <span className="text-sm text-gray-600">({reviewCount} Reviews)</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-black">
          {formatPrice(price)}
        </span>
        {originalPrice > price && (
          <span className="text-xl text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {/* Variant Selection */}
      {attributes.length > 0 && (
        <div>
          <div className="flex flex-col items-start justify-between mb-5">
            <span className="text-sm font-medium">Choose Variant :</span>
            <span className="text-lg font-bold mt-2">
              {selectedVariant
                ? selectedVariant.color_name || `Variant ${selectedVariant.id}`
                : "Select a variant to see details"}
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {attributes.map((variant, index) => (
              <button
                key={variant.id || index}
                onClick={() => onVariantSelect && onVariantSelect(variant)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 relative ${
                  selectedVariant?.id === variant.id
                    ? "border-black ring-2 ring-black ring-offset-2"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {variant.attr_image ? (
                  <img
                    src={variant.attr_image}
                    alt={variant.color_name || `Variant ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xs text-white font-medium"
                    style={{
                      backgroundColor:
                        getColorFromName(variant.color_name) || "#cccccc",
                    }}
                  >
                    {variant.color_name || `V${index + 1}`}
                  </div>
                )}
                {/* Price indicator */}
                {variant.price && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 text-center">
                    ${parseFloat(variant.price).toFixed(0)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection (fallback for products without variants) */}
      {attributes.length === 0 && colors.length > 0 && (
        <div>
          <div className="flex flex-col items-start justify-between mb-5">
            <span className="text-sm font-medium">Choose Color :</span>
            <span className="text-lg font-bold mt-2">
              {colors[selectedColor].name}
            </span>
          </div>
          <div className="flex gap-3">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedColor === index
                    ? "border-black ring-2 ring-black ring-offset-2"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {color.image ? (
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xs text-white font-medium"
                    style={{
                      backgroundColor:
                        getColorFromName(color.name) || "#cccccc",
                    }}
                  >
                    {color.name}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <span className="text-sm font-medium mb-3 block">Quantity:</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-lg font-medium w-12 text-center">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            className="w-10 h-10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleAddToCart}
          className={`flex-1 py-3 text-lg font-medium ${
            isInCart(product.id)
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isInCart(product.id) ? "Carted" : "Add to Cart"}
        </Button>
        <Button
          variant="outline"
          onClick={handleAddToWishlist}
          className="px-6 border-black text-black hover:bg-gray-50"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Variant Details */}
      {selectedVariant && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">
            Selected Variant Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <span className="text-gray-600">Color:</span>
              <span
                className={`inline-block ml-2 font-medium h-5 w-10 rounded-full`}
                style={{ backgroundColor: selectedVariant.color_name }}
              ></span>
            </div>
            <div>
              <span className="text-gray-600">Dimensions:</span>
              <span className="ml-2 font-medium">
                {selectedVariant.size_name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Quantity:</span>
              <span className="ml-2 font-medium">{selectedVariant.qty}</span>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <span className="ml-2 font-medium">
                {formatPrice(parseFloat(selectedVariant.price))}
              </span>
            </div>
            {selectedVariant.mrp &&
              parseFloat(selectedVariant.mrp) >
                parseFloat(selectedVariant.price) && (
                <div>
                  <span className="text-gray-600">MRP:</span>
                  <span className="ml-2 font-medium line-through">
                    {formatPrice(parseFloat(selectedVariant.mrp))}
                  </span>
                </div>
              )}
          </div>
        </div>
      )}

      {/* SKU & Category */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">SKU:</span>
            <span className="ml-2 font-medium">{sku}</span>
          </div>
          <div>
            <span className="text-gray-600">CATEGORY:</span>
            <span className="ml-2 font-medium">{category}</span>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default ProductInfo;
