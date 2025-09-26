import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

/**
 * ShopProductCard Component
 * A product card specifically designed for the shop page matching the provided design
 */
const ShopProductCard = ({ product, className = "" }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const {
    id,
    name,
    image,
    slug,
    attributes = [],
    avg_rating = "0",
    is_arrival = false,
    is_discounted = false,
    is_promo = false,
    short_desc,
  } = product;

  // Calculate price from attributes
  const getPrice = () => {
    if (!attributes || attributes.length === 0) return 0;
    const prices = attributes
      .map((attr) => parseFloat(attr.price))
      .filter((price) => !isNaN(price) && price > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getOriginalPrice = () => {
    if (!attributes || attributes.length === 0) return null;
    const mrpPrices = attributes
      .map((attr) => parseFloat(attr.mrp))
      .filter((price) => !isNaN(price) && price > 0);
    const maxMrp = mrpPrices.length > 0 ? Math.max(...mrpPrices) : null;
    const currentPrice = getPrice();
    return maxMrp && maxMrp > currentPrice ? maxMrp : null;
  };

  const price = getPrice();
  const originalPrice = getOriginalPrice();
  const rating = parseFloat(avg_rating) || 0;
  const isNew = is_arrival;
  const isOnSale = is_discounted || is_promo;
  const description = short_desc;

  // Format price to currency
  const formatPrice = (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return "Price not available";
    }
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCardClick = () => {
    navigate(`/product-details/${slug || id}`);
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 border-none shadow-none rounded-none ${className} p-0`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-col gap-3">
          {/* Product Image Section */}
          <div className="relative overflow-hidden bg-gray-100">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
              {isNew && (
                <Badge
                  variant="default"
                  className="bg-white text-black hover:bg-gray-100 text-xs font-medium px-2 py-1"
                >
                  NEW
                </Badge>
              )}
              {isOnSale && (
                <Badge
                  variant="destructive"
                  className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-2 py-1"
                >
                  -50%
                </Badge>
              )}
            </div>

            {/* Product Image */}
            <img
              src={image || "/placeholder-product.jpg"}
              alt={name || "Product"}
              className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-2 p-5">
            {/* Star Rating */}
            <div className="flex items-center gap-1">{renderStars()}</div>

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-black text-lg">
                {formatPrice(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                onClick={handleAddToCart}
                className={`flex-1 py-2 text-sm font-medium ${
                  isInCart(id)
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isInCart(id) ? "Added to cart" : "Add to cart"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddToWishlist}
                className={`border-gray-300 hover:bg-gray-50 ${
                  isInWishlist(id)
                    ? "text-red-500 bg-red-50 border-red-200"
                    : "text-gray-600"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isInWishlist(id) ? "fill-current" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopProductCard;
