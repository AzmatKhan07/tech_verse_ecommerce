import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Minus, Plus } from "lucide-react";

/**
 * ProductInfo Component
 * Displays product information, pricing, options, and action buttons with dynamic countdown timer
 */
const ProductInfo = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);

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
  } = product;

  // Format price to currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
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
    console.log(
      `Adding ${quantity} ${name} in ${colors[selectedColor].name} to cart`
    );
    // TODO: Implement add to cart functionality
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

  // Initialize and manage countdown timer
  useEffect(() => {
    // Calculate target end time (e.g., 2 days, 12 hours, 45 minutes, 5 seconds from now)
    // You can modify this to use a specific end date from your product data
    const now = new Date().getTime();
    const targetTime =
      now +
      offerTimer.days * 24 * 60 * 60 * 1000 +
      offerTimer.hours * 60 * 60 * 1000 +
      offerTimer.minutes * 60 * 1000 +
      offerTimer.seconds * 1000;

    const updateTimer = () => {
      const currentTime = new Date().getTime();
      const timeDifference = targetTime - currentTime;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Timer has ended
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Update immediately
    updateTimer();

    // Set up interval to update every second
    const timer = setInterval(updateTimer, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [offerTimer]);

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

      {/* Dynamic Offer Timer */}
      <div className="p-4 rounded-lg border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Offer ends in:</p>
        {timeLeft ? (
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="text-center">
              <span className="bg-gray-100 text-black px-2 py-1 rounded text-5xl w-24 h-24 flex items-center justify-center">
                {timeLeft.days.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-600">Days</span>
            </div>
            <div className="text-center">
              <span className="bg-gray-100 text-black px-2 py-1 rounded text-5xl w-24 h-24 flex items-center justify-center">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-600">Hours</span>
            </div>
            <div className="text-center">
              <span className="bg-gray-100 text-black px-2 py-1 rounded text-5xl w-24 h-24 flex items-center justify-center">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-600">Minutes</span>
            </div>
            <div className="text-center">
              <span className="bg-gray-100 text-black px-2 py-1 rounded text-5xl w-24 h-24 flex items-center justify-center">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-600">Seconds</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <span className="text-gray-500">Loading timer...</span>
          </div>
        )}

        {/* Show expired message when timer reaches zero */}
        {timeLeft &&
          timeLeft.days === 0 &&
          timeLeft.hours === 0 &&
          timeLeft.minutes === 0 &&
          timeLeft.seconds === 0 && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-center">
              <span className="text-red-600 font-semibold">
                🔥 Offer Expired!
              </span>
            </div>
          )}
      </div>

      {/* Measurements */}
      <div>
        <div className="">
          <p className="">Dimensions:</p>
          <span className="text-gray-600 text-lg font-bold">
            {measurements}
          </span>
        </div>
      </div>

      {/* Color Selection */}
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
              <img
                src={color.image}
                alt={color.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

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
          className="flex-1 bg-black text-white hover:bg-gray-800 py-3 text-lg font-medium"
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          onClick={handleAddToWishlist}
          className="px-6 border-black text-black hover:bg-gray-50"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </div>

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
    </div>
  );
};

export default ProductInfo;
