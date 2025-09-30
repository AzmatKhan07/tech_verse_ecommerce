import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const WishlistItem = ({ product }) => {
  const { removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleRemoveFromWishlist = (e) => {
    e.stopPropagation();
    removeFromWishlist(product.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleProductClick = () => {
    navigate(`/product-details/${product.id}`);
  };

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemoveFromWishlist}
        className="text-gray-400 hover:text-red-500 p-1 h-auto"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Product Image */}
      <div
        className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
        onClick={handleProductClick}
      >
        <img
          src={product.image}
          alt={product.alt || product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3
          className="font-medium text-gray-900 cursor-pointer hover:text-black"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-500 mt-1">
            Color: {product.description}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        className={`px-6 py-2 text-sm ${
          isInCart(product.id)
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {isInCart(product.id) ? "Added to cart" : "Add to cart"}
      </Button>
    </div>
  );
};

export default WishlistItem;
