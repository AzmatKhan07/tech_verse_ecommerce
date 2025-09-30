import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/lib/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Get the first available attribute for the product
      const selectedAttribute = product.attributes?.[0] || null;
      await addToCart(product, 1, selectedAttribute);
      toast({
        title: "Added to Cart",
        description: `${name} has been added to your cart.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    }
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
            src={image || "/placeholder-product.jpg"}
            alt={name || "Product"}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder-product.jpg";
            }}
          />

          {/* Add to Cart Button - Appears on Hover */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              className={`px-6 py-2 text-sm font-medium rounded-md w-full flex items-center gap-2 ${
                isInCart(id)
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <ShoppingCartIcon className="w-4 h-4" />
              {isInCart(id) ? "Added to cart" : "Add to cart"}
            </Button>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4 space-y-3">
          {/* Star Rating */}
          <div className="flex items-center gap-1">{renderStars()}</div>

          {/* Product Name */}
          <h3
            className="font-medium text-gray-900 text-sm leading-tight line-clamp-2"
            onClick={() => {
              navigate(`/product-details/${slug || id}`);
            }}
          >
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
