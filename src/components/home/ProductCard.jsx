import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCartIcon } from "lucide-react";

/**
 * ProductCard Component
 * A reusable card component for displaying product information
 *
 * @param {Object} product - Product data object
 * @param {string} product.id - Unique product identifier
 * @param {string} product.name - Product name
 * @param {string} product.image - Product image URL
 * @param {string} product.alt - Image alt text
 * @param {number} product.price - Product price
 * @param {number} product.originalPrice - Original price (for discounted items)
 * @param {number} product.rating - Product rating (1-5)
 * @param {boolean} product.isNew - Whether product is new
 * @param {boolean} product.isOnSale - Whether product is on sale
 * @param {string} className - Additional CSS classes
 */
const ProductCard = ({ product, className = "" }) => {
  const {
    id,
    name,
    image,
    alt,
    price,
    originalPrice,
    rating = 5,
    isNew = false,
    isOnSale = false,
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    // TODO: Implement add to cart functionality
    console.log(`Adding product ${id} to cart`);
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 border-none ${className}`}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {isNew && (
              <Badge
                variant="default"
                className="bg-white text-black hover:bg-gray-100 text-xs font-medium"
              >
                NEW
              </Badge>
            )}
            {isOnSale && (
              <Badge
                variant="destructive"
                className="bg-green-500 hover:bg-green-600 text-xs font-medium"
              >
                SALE
              </Badge>
            )}
          </div>

          {/* Product Image */}
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Add to Cart Button - Appears on Hover */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-sm font-medium rounded-md w-full"
            >
              <ShoppingCartIcon className="w-4 h-4" /> Add to cart
            </Button>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4 space-y-3">
          {/* Star Rating */}
          <div className="flex items-center gap-1">{renderStars()}</div>

          {/* Product Name */}
          <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
